module.exports = function (grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');

    grunt.initConfig({
        jslint: {
            grunt: {
                src: 'Gruntfile.js',
                directives: {
                    predef: ['module']
                }
            },
            client: 'public/client.js',
            tests: {
                src: 'test/browser/tests.js',
                directives: {
                    predef: [
                        'describe',
                        'before',
                        'after',
                        'it',
                        'sinon'
                    ]
                }
            }
        },
        mocha_phantomjs: {
            all: 'test/browser/index.html'
        }
    });

    grunt.registerTask('test', ['jslint', 'mocha_phantomjs']);
};
