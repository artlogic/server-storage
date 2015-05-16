server-storage
==============

 A RESTful reimplementation of localStorage using Express and MongoDB.

TODO
----

### general

* switch from jslint to jshint

### client interface

* emulate storage events
* make sure 422, 500, and other errors are handled gracefully
* document w/ jsdoc (or dox/doxx)

### server interface

* Tests - definitely for the server
  * http://strongloop.com/strongblog/how-to-test-an-api-with-node-js/
  * https://github.com/tj/supertest - https://github.com/visionmedia/supertest
* heroku - make sure it works, including allow an app to be served statically
* follow the node style guide: https://github.com/felixge/node-style-guide
* setup travis: https://travis-ci.org/profile/artlogic
* document: samwize.com/2014/01/31/the-best-documentation-generator-for-node/

How to do this? It almost seems like server-storage needs to be 3 things:
* a service that works with mongo and runs server storage REST API
* a command line utility that serves a static app and kicks up the REST API
* a heroku enabled deployment that serves a static app and the REST API
* consider - https://devcenter.heroku.com/articles/heroku-button (should we turn on cross domain by default?)

So, how do we do the static app + REST API? Another npm command? A config option?

But how do we use this via npm? How would we use this as a dependency with heroku?


* Add a bit of documentation for the server side API... the client lib should just need to be included as it matches the w3 storage spec.  Use this: https://github.com/danielgtaylor/aglio
* Add install instructions to the readme
* Complete move to the nsbasic account
* List on NPM
* Add a executable (that installs on the path using npm) - the idea here is to be able to develop locally with a single command - https://docs.npmjs.com/files/package.json#bin
  * configure settings via command line
  * maybe a man page too? npm can do that!
