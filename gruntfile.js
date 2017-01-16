module.exports = function (grunt) {

    // configure tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        less: {
            development: {
                files: {
                    'css/main.css': 'css/main.less'
                }
            }
        },
        cssmin: {
            options: {
                sequence: false
            },
            target: {
                files: {
                    'css/main.min.css': 'css/main.css'
                }
            }
        },
        watch: {
            styles: {
                files: ['css/*.less'], // which files to watch
                tasks: ['less', 'cssmin', 'concat:dist_css'],
                options: {
                    nospawn: true
                }
            },
            scripts: {
                files: ['js/*.js', '!js/*.min.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    nospawn: true
                }
            }
        },
        concat: {
            dist_main: {
                src: [
                    // utility module
                    'js/utility.module.js',
                    'js/utility.page.provider.js',
                    // github module
                    'js/github.module.js',
                    'js/github.gitBase.provider.js',
                    'js/github.gitService.provider.js',
                    'js/github.kinveyBase.provider.js',
                    'js/github.kinveyService.provider.js',
                    'js/github.auth.controller.js',
                    // main module
                    'js/main.module.js',
                    'js/main.home.controller.js',
                    'js/main.search.controller.js',
                    'js/main.user.controller.js'
                ],
                dest: 'js/app.compiled.js',
            },
            dist_libs: {
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'bower_components/angular/angular.min.js',
                    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'bower_components/ngStorage/ngStorage.min.js',
                    'bower_components/bootstrap/dist/js/bootstrap.min.js',
                    'bower_components/angulartics/dist/angulartics.min.js',
                    'bower_components/angulartics-google-analytics/dist/angulartics-ga.min.js'
                ],
                dest: 'js/libs.min.js',
            },
            dist_css: {
                src: [
                    'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'css/main.min.css'
                ],
                dest: 'css/app.compiled.min.css',
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/fonts/',
                        src: ['**'],
                        dest: 'fonts/',
                        filter: 'isFile'
                    }
                ],
            },
        },
        uglify: {
            target: {
                files: {
                    // 'js/app.min.js': ['js/app.js'],
                    // 'js/app.main.controller.min.js': ['js/app.main.controller.js'],
                    // 'js/app.gitService.provider.min.js': ['js/app.gitService.provider.js'],
                    'js/app.compiled.min.js': 'js/app.compiled.js'
                }
            }
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // register tasks
    grunt.registerTask('default', ['copy', 'less', 'cssmin', 'concat', 'uglify', 'watch']);
}
