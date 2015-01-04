/*jslint browser: true */

var serverStorage = (function () {
    "use strict";

    var pub = {};

    // calculate the database from the executing page's path
    // find the first part of a path, for example: given '/HelloWorld/index.html'
    // return '/HelloWorld/' and 'HelloWorld' (first group)
    // also, given /apps/HelloWorld/index.html
    // return '/apps/HelloWorld/' 'apps/HelloWorld' (first group)
    function database() {
        // use constructor - this literal is confusing
        var db_re = new RegExp('/(.*)/'),
            db_raw = db_re.exec(document.location.pathname);

        // if there's a problem determining the database, set a default one
        return db_raw ? db_raw[1] : 'default';
    }

    // calculate the apibase from this script's location
    // modifed from: http://stackoverflow.com/a/8523852
    function apibase() {
        var scripts = document.getElementsByTagName('script'),
            script = scripts[scripts.length - 1];

        return script.src.substr(0, script.src.lastIndexOf('/'));
    }

    // This is a vastly simplified version of jQuery.param
    function param(obj) {
        var key,
            s = [];
        // assume only the simplest case, an object of non-null scalar items
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                s.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }
        // Return the resulting serialization
        return s.join('&').replace(/%20/g, '+');
    }

    // the the xhr request has returned a JSON response, parse and
    // return, otherwise return undefined
    function jsonify(xhr) {
        var ctype = xhr.getResponseHeader('Content-Type');
        if (ctype && ctype.indexOf('application/json') > -1) {
            return JSON.parse(xhr.responseText);
        }
    }

    // makes an ajax request
    //
    // method a string - the request method
    // settings an object, optional - with the following keys:
    // - url: a string, optional - defaults to '/'
    // - key: a string, optional - the key to operate on - becomes part of
    //        the query string
    // - value: a string, optional - the value to set in the transaction
    // - callback: a function, optional - causes the request to be async
    //             the function should take a single data parameter which
    //             is the JSON parsed return value from the API
    function makeRequest(method, options) {
        options = options || {};
        var xhr = new XMLHttpRequest(),
            url = pub.apibase + (options.url || '/') + '?',
            async = Boolean(options.callback),
            data = {},
            params = {
                db: pub.database,
                '_': (new Date()).getTime().toString()  // avoid caching
            },
            callback = options.callback;

        // move key into the querystring, if it's there
        if (options.key) {
            params.key = options.key;
        }
        url += param(params);

        // stringify the value, if needed
        if (options.value) {
            data.value = JSON.stringify(options.value);
        }
        data = param(data);

        // init the request
        xhr.open(method, url, async);

        // if it's async set up the callback
        if (async) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    callback(jsonify(xhr));
                }
            };
        }

        // if there is data, send it as the request body, otherwise just send
        if (data) {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(data);
        } else {
            xhr.send();
        }

        // return the value (if not async) or undefined
        return jsonify(xhr);
    }

    // the following are not part of http://dev.w3.org/html5/webstorage/#storage
    // being able to set your database and apibase might be useful/needed
    pub.database = database();
    pub.apibase = apibase();
    // needed to support async
    pub.getLength = function (cb) {
        return makeRequest('GET', {url: '/length', callback: cb});
    };

    // w3's API starts here
    Object.defineProperty(pub, 'length', {get: function () {
        return pub.getLength();
    }});

    pub.clear = function (cb) {
        makeRequest('DELETE', {callback: cb});
    };

    pub.key = function (index, cb) {
        return makeRequest('GET', {url: '/key/' + index.toString(), callback: cb});
    };

    pub.getItem = function (key, cb) {
        return makeRequest('GET', {'key': key, callback: cb});
    };

    pub.setItem = function (key, value, cb) {
        makeRequest('POST', {'key': key, 'value': value, callback: cb});
    };

    pub.removeItem = function (key, cb) {
        makeRequest('DELETE', {'key': key, callback: cb});
    };

    return pub;
}());
