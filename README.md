server-storage
==============

A RESTful reimplementation of localStorage using Express and MongoDB.

Prerequisites
-------------

To run this package you must have [Node.js](https://nodejs.org/), and [MongoDB](https://www.mongodb.org/) installed. You'll probably also want either [Apache](https://www.apache.org/) or [Nginx](http://nginx.org/) to act as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy), the configuration of which is beyond the scope of this document. You'll also want git, so you can clone the repo.

Installation
------------

1. Decide where you'd like to put the service and clone the repo using your favorite interface to git.
2. From the root of the repo, run `npm install`.
3. Configure the environment variables (documented below) appropriately.
4. Make sure MongoDB is up and running on the localhost interface, port 27017 (the default). This service will store all it's data in a database called `server-storage`.
5. Type `npm start`. server-storage will now be running on the PORT and HOST you configured below.

Now, you can simply include http://HOST:PORT/client.js in your applications and use the serverStorage object it creates much like localStorage.

Environment Variables
---------------------

* PORT - the port to start the service on (defaults to 3000)
* HOST - the interface to start the service on (defaults to 127.0.0.1)
* PROXY - if you are using a reverse proxy, set this to true, otherwise, leave it unset
