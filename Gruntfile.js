var config = require('./private/config');
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-screeps');
    grunt.initConfig({
        screeps: {
            options: {
                email: config.email,
                password: config.password,
                //branch: 'default',
                branch: 'test',
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
};
