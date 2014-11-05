var serverStorage = (function (global, $) {
    "use strict";

    // this should not be hard coded... we need a setting of some sort
    var base = '/api/storage',
        pub = {},
        // find the first part of a path, for example: given '/HelloWorld/index.html
        // return /HelloWorld/ and HelloWorld (first group)
        ns_re = new RegExp('/([^/]*)/'),
        // if there's a problem determining the namespace, set a default one
        ns_raw = ns_re.exec(global.document.location.pathname),
        namespace = ns_raw ? ns_raw[1] : 'default';

    // both url and data are optional
    function makeRequest(method, url, data) {
        if ($.type(url) !== 'string') {
            data = url;
            url = '/';
        }

        var response,
            params = {ns: namespace},
            settings = {
                async: false,
                cache: false,
                type: method,
                'url': base + url + '?',
                success: function (data) {
                    response = data;
                }
            };

        // move key into the querystring, if it's there and out of data
        if (data && data.key) {
            params.key = data.key;
            delete data.key;
        }
        params = $.param(params);

        // stringify the value, if needed
        if (data && data.value) {
            data.value = JSON.stringify(data.value);
        }

        // finish configuring settings now that we have data and params
        settings.data = data;
        settings.url += params;

        // this really shouldn't be synchronous, but we'd have to
        // change the public API otherwise :/
        $.ajax(settings);

        // assume success was executed
        return response;
    }

    // not part of http://dev.w3.org/html5/webstorage/#storage
    // however, it might be useful to be able to change your namespace
    pub.namespace = namespace;

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
        return makeRequest('POST', {'key': key, 'value': value});
    };

    pub.removeItem = function (key) {
        makeRequest('DELETE', {'key': key});
    };

    return pub;
}(window, jQuery));
