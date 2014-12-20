var mongo = require('mongoskin')
var db = mongo.db('mongodb://localhost:27017/server-storage')
var express = require('express')
var logging = require('morgan')
var app = express()
var bodyParser = require('body-parser')
var path = require('path')

// middleware
app.use(logging('combined'))
app.use(express.static(path.resolve(__dirname, 'public')))

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false})

// None of these calls fail hard (with a 4xx code). All return, soft failing like in the browser.
// All calls include a database variable, for example: ?db=xzyqHelloWorld
// The calls WILL fail if a database is omitted

// GET /?key=<key>  # returns the string associated with <key> or null as JSON
app.get('/', function (req, res) {
    var database = req.query.db
    var key = req.query.key
    if (!database || !key) {
        res.sendStatus(422)
        return
    }

    var data = db.collection(database)

    data.findById(key, function (e, doc) {
        var doc = doc || {value: null}
        res.json(doc.value)
    })
})

// POST /?key=<key>  # updates the <key> - expects the request body to be x-form-urlencoded data
// with value="string" or null (could potentially be any valid JSON)
app.post('/', urlencodedParser, function (req, res) {
    var database = req.query.db
    var key = req.query.key
    var value = JSON.parse(req.body.value)
    if (!database || !key || (typeof value === 'undefined')) {
        res.sendStatus(422)
        return
    }

    var data = db.collection(database)

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

// GET /key/<n>  # returns the name of the nth key in the list or null - this will be tricky
app.get('/key/:n', function (req, res) {
    var database = req.query.db
    var n = req.params.n
    if (!database || (typeof n === 'number')) {
        res.sendStatus(422)
        return
    }

    var data = db.collection(database)

    data.findItems(function (e, docs) {
        var doc = docs[n] || {_id: null}
        res.json(doc._id)
    })
})

// GET /length  # returns the length of the database - an integer
app.get('/length', function (req, res) {
    var database = req.query.db
    if (!database) {
        res.sendStatus(422)
        return
    }

    var data = db.collection(database)

    data.count({}, function (e, n) {
        res.json(n)
    })
})

// DELETE /?key=<key>  # deletes the key (not the same as updating to null, apparently)
// DELETE /  # clears the entire data store
app.delete('/', function (req, res) {
    var database = req.query.db
    if (!database) {
        res.sendStatus(422)
        return
    }

    var key = req.query.key
    var data = db.collection(database)

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
var proxy = process.env.PROXY || false

if (proxy) app.enable('trust proxy')

var server = app.listen(port, host, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Server storage app listening at http://%s:%s', host, port)
})
