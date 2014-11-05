var mongo = require('mongoskin')
var db = mongo.db('mongodb://localhost:27017/server-storage')
var express = require('express')
var logging = require('morgan')
var app = express()
var bodyParser = require('body-parser')

// middleware
app.use(logging('combined'))
app.use(express.static('public'))

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false})

// None of these calls fail hard (with a 4xx code). All return, soft failing like in the browser.
// All calls include a namespace variable, for example: ?ns=xzyqHelloWorld
// The calls WILL fail if a namespace is omitted

// GET /storage?key=<key>  # returns the string associated with <key> or null as JSON
app.get('/storage', function (req, res) {
    var namespace = req.query.ns
    var key = req.query.key
    if (!namespace || !key) {
        res.setStatus(422)
        return
    }

    var data = db.collection(namespace)

    data.findById(key, function (e, doc) {
        var doc = doc || {value: null}
        res.json(doc.value)
    })
})

// POST /storage?key=<key>  # updates the <key> - expects the request body to be x-form-urlencoded data
// with value="string" or null (could potentially be any valid JSON)
app.post('/storage', urlencodedParser, function (req, res) {
    var namespace = req.query.ns
    var key = req.query.key
    var value = JSON.parse(req.body.value)
    if (!namespace || !key || (typeof value === 'undefined')) {
        res.setStatus(422)
        return
    }

    var data = db.collection(namespace)

    data.findById(key, function (e, doc) {
        if (doc === null) {
            // not found
            data.insert({_id: key, 'value': value}, function () {
                res.sendStatus(200)
            })
        } else {
            data.updateById(key, {'value': value}, function () {
                res.sendStatus(200)
            })
        }
    })
})

// GET /storage/key/<n>  # returns the name of the nth key in the list or null - this will be tricky
app.get('/storage/key/:n', function (req, res) {
    var namespace = req.query.ns
    var n = req.params.n
    if (!namespace || (typeof n === 'number')) {
        res.setStatus(422)
        return
    }

    var data = db.collection(namespace)

    data.findItems(function (e, docs) {
        var doc = docs[n] || {_id: null}
        res.json(doc._id)
    })
})

// GET /storage/length  # returns the length of the namespace - an integer
app.get('/storage/length', function (req, res) {
    var namespace = req.query.ns
    if (!namespace) {
        res.setStatus(422)
        return
    }

    var data = db.collection(namespace)

    data.count({}, function (e, n) {
        res.json(n)
    })
})

// DELETE /storage?key=<key>  # deletes the key (not the same as updating to null, apparently)
// DELETE /storage  # clears the entire data store
app.delete('/storage', function (req, res) {
    var namespace = req.query.ns
    if (!namespace) {
        res.setStatus(422)
        return
    }

    var key = req.query.key
    var data = db.collection(namespace)

    if (key) {
        // delete the key
        data.removeById(key, function () {
            res.sendStatus(200)
        })
    } else {
        // clear the store
        data.drop(function () {
            res.sendStatus(200)
        })
    }
})

var port = process.env.PORT || 3000
var host = process.env.HOST || '127.0.0.1'
var server = app.listen(port, host, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Server storage app listening at http://%s:%s', host, port)
})
