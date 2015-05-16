/*global serverStorage: false */

describe('serverStorage', function () {
    "use strict";

    var apibase = 'http://example.com',  // this is a (partial) regexp
        database = 'testdata',
        server;

    before(function () {
        serverStorage.database = database;
        serverStorage.apibase = apibase;
        server = sinon.fakeServer.create();
    });
    after(function () { server.restore(); });

    describe('.getLength()', function () {
        it('creates a proper synchronous request and returns a value', function () {
            server.respondWith([200, {'Content-Type': 'application/json'}, '10']);

            var length = serverStorage.getLength(),
                request = server.requests[server.requests.length - 1];

            request.url.should.match(new RegExp(apibase + '/length\\?db=' + database +
                                                '&_=[0-9]+'));
            request.method.should.equal('GET');
            request.async.should.be.false();

            length.should.equal(10);
        });

        it('creates a proper asynchronous request and returns a value', function () {
            server.respondWith([200, {'Content-Type': 'application/json'}, '10']);

            var callback = sinon.spy(),
                request;

            serverStorage.getLength(callback);
            server.respond();

            request = server.requests[server.requests.length - 1];

            request.url.should.match(new RegExp(apibase + '/length\\?db=' + database +
                                                '&_=[0-9]+'));
            request.method.should.equal('GET');
            request.async.should.be.true();

            callback.should.have.been.calledWith(10);
        });
    });

    describe('.length', function () {
        it('creates a proper request and returns a result', function () {
            server.respondWith([200, {'Content-Type': 'application/json'}, '10']);

            var length =  serverStorage.length,
                request = server.requests[server.requests.length - 1];

            request.url.should.match(new RegExp(apibase + '/length\\?db=' + database +
                                                '&_=[0-9]+'));
            request.method.should.equal('GET');
            request.async.should.be.false();

            length.should.equal(10);
        });
    });

    describe('.clear()', function () {
        it('creates a proper synchronous request', function () {
            serverStorage.clear();

            var request = server.requests[server.requests.length - 1];
            request.url.should.match(new RegExp(apibase + '/\\?db=' + database +
                                                '&_=[0-9]+'));
            request.method.should.equal('DELETE');
            request.async.should.be.false();
        });

        it('creates a proper asynchronous request', function () {
            var callback = sinon.spy(),
                request;

            serverStorage.clear(callback);
            server.respond();

            request = server.requests[server.requests.length - 1];
            request.url.should.match(new RegExp(apibase + '/\\?db=' + database +
                                                '&_=[0-9]+'));
            request.method.should.equal('DELETE');
            request.async.should.be.true();

            // use callCount so we lint properly... annoying
            callback.should.have.callCount(1);
        });
    });

    describe('.key()', function () {
        var testkey = 'test',
            index = 0;

        it('creates a proper synchronous request and returns a result', function () {
            server.respondWith([200, {'Content-Type': 'application/json'},
                                JSON.stringify(testkey)]);

            var key = serverStorage.key(index),
                request = server.requests[server.requests.length - 1];

            request.url.should.match(new RegExp(apibase + '/key/' + index.toString() +
                                                '\\?db=' + database + '&_=[0-9]+'));
            request.method.should.equal('GET');
            request.async.should.be.false();

            key.should.equal(testkey);
        });

        it('creates a proper asynchronous request and returns a result', function () {
            server.respondWith([200, {'Content-Type': 'application/json'},
                                JSON.stringify(testkey)]);

            var callback = sinon.spy(),
                request;

            serverStorage.key(index, callback);
            server.respond();

            request = server.requests[server.requests.length - 1];

            request.url.should.match(new RegExp(apibase + '/key/' + index.toString() +
                                                '\\?db=' + database + '&_=[0-9]+'));
            request.method.should.equal('GET');
            request.async.should.be.true();

            callback.should.be.calledWith(testkey);
        });
    });

    describe('.getItem()', function () {
        var testkey = 'test',
            testvalue = 'value';

        it('creates a proper synchronous request and returns a result', function () {
            server.respondWith([200, {'Content-Type': 'application/json'},
                                JSON.stringify(testvalue)]);

            var value = serverStorage.getItem(testkey),
                request = server.requests[server.requests.length - 1];

            request.url.should.match(new RegExp(apibase + '/\\?db=' + database +
                                                '&_=[0-9]+&key=' + testkey));
            request.method.should.equal('GET');
            request.async.should.be.false();

            value.should.equal(testvalue);
        });

        it('creates a proper asynchronous request and returns a result', function () {
            server.respondWith([200, {'Content-Type': 'application/json'},
                                JSON.stringify(testvalue)]);

            var callback = sinon.spy(),
                request;

            serverStorage.getItem(testkey, callback);
            server.respond();

            request = server.requests[server.requests.length - 1];

            request.url.should.match(new RegExp(apibase + '/\\?db=' + database +
                                                '&_=[0-9]+&key=' + testkey));
            request.method.should.equal('GET');
            request.async.should.be.true();

            callback.should.be.calledWith(testvalue);
        });
    });

    describe('.setItem()', function () {
        var testkey = 'test',
            testvalue = 'value';

        it('creates a proper synchronous request', function () {
            serverStorage.setItem(testkey, testvalue);

            var request = server.requests[server.requests.length - 1];

            request.url.should.match(new RegExp(apibase + '/\\?db=' + database +
                                                '&_=[0-9]+&key=' + testkey));
            request.requestBody.should.equal('value=' + encodeURIComponent(JSON.stringify(testvalue)));
            request.method.should.equal('POST');
            request.async.should.be.false();
        });

        it('creates a proper asynchronous request', function () {
            return;
        });
    });

    describe('.removeItem()', function () {
        var testkey = 'test';

        it('creates a proper synchronous request', function () {
            serverStorage.removeItem(testkey);

            var request = server.requests[server.requests.length - 1];
            request.url.should.match(new RegExp(apibase + '/\\?db=' + database +
                                                '&_=[0-9]+&key=' + testkey));
            request.method.should.equal('DELETE');
            request.async.should.be.false();
        });

        it('creates a proper asynchronous request', function () {
            var callback = sinon.spy(),
                request;

            serverStorage.removeItem(testkey, callback);
            server.respond();

            request = server.requests[server.requests.length - 1];
            request.url.should.match(new RegExp(apibase + '/\\?db=' + database +
                                                '&_=[0-9]+&key=' + testkey));
            request.method.should.equal('DELETE');
            request.async.should.be.true();

            // use callCount so we lint properly... annoying
            callback.should.have.callCount(1);
        });
    });
});
