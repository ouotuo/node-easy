module.exports = (grunt) ->
    src='src'
    lib='lib'

    testsrc='test/src'
    testlib='test/lib'

    grunt.initConfig(
        pkg: grunt.file.readJSON('package.json')
        clean:
            lib:[lib]
            testlib:[testlib]
    
        coffee:
            src:
                expand: true
                flatten: false
                cwd: src
                src: ['**/*.coffee']
                dest: lib
                ext: '.js'
            test:
                expand: true
                flatten: false
                cwd: testsrc
                src: ['**/*.coffee']
                dest: testlib
                ext: '.js'
        copy:
            src_to_lib:
                files:[
                    {cwd:src,src:['**/*.json','**/*.js'],dest:lib,expand:true,flatten:false,filter:'isFile'}
                ]
        exec:
            run:
                cmd: 'node index.js'

        "jasmine-node":
            options:
                coffee:false
                forceexit: false
                verbose:true
            run:
                spec:testlib
        watch:
            coffee_src:
                files: ["#{src}/**/*.coffee"]
                tasks: ['coffee:src']
                options:
                    livereload:32699
            coffee_test:
                files: ["#{testsrc}/**/*.coffee"]
                tasks: ['coffee:test']
                options:
                    livereload:32700
            copy_src_to_lib:
                files: ["#{src}/**/*.json","#{src}/**/*.js"]
                tasks: ['copy:src_to_lib']
                options:
                    livereload:32701
    )
    
    grunt.loadNpmTasks('grunt-contrib-coffee')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-exec')
    grunt.loadNpmTasks('grunt-contrib-jasmine-node')

    grunt.registerTask('test',['clean:testlib','coffee:test','jasmine-node'])
    grunt.registerTask('run',['exec:run'])
    grunt.registerTask('compile',['clean:lib','coffee','copy:src_to_lib'])
    grunt.registerTask('default',"compile")
    
