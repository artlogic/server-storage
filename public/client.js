var serverStorage = (function (global, $) {
    "use strict";

    // we could potentially sense the base host
    var base = '//nsbapp.com/storage',
        pub = {},
        // find the first part of a path, for example: given '/HelloWorld/index.html
        // return /HelloWorld/ and HelloWorld (first group)
        ns_re = new RegExp('/([^/]*)/'),
        // if there's a problem determining the namespace, set a default one
        ns_raw = ns_re.exec(global.document.location.pathname),
        namespace = ns_raw ? ns_raw[1] : 'default';

    // both url and data are optional
    function makeRequest(method, url, data) {
        if ($.type(url) === 'object') {
            data = url;
            url = '';
        }

        var response, settings = {
            async: false,
            cache: false,
            type: method,
            'data': data || {},
            'url': base + url,
            success: function (data) {
                response = data;
            }
        };
        settings.data.ns = pub.ns;

        // this really shouldn't be synchronous, but we'd have to
        // change the public API otherwise :/
        $.ajax(settings);

        // assume success was executed
        return response;
    }

    // not part of http://dev.w3.org/html5/webstorage/#storage
    // however, it might be useful to be able to change your namespace
    pub.ns = namespace;

    Object.defineProperty(pub, 'length', {get: function () {
        return makeRequest('GET', '/length');
    }});

    pub.clear = function () {
        makeRequest('DELETE');
    };

    pub.key = function (index) {
        return makeRequest('GET', '/key/' + index.toString());
    };

    pub.getItem = function (key) {
        return makeRequest('GET', {'key': key});
    };

    pub.setItem = function (key, value) {
        // we use URL to pass a query string because... maybe the API
        // should be better?
        return makeRequest('POST', '?key=' + key, {'value': value});
    };

    pub.removeItem = function (key) {
        makeRequest('DELETE', {'key': key});
    };

    return pub;
}(window, jQuery));
