#!/usr/bin/env node

const program = require('commander');

// commnander - command line options and arguments
program.version('0.1.0')
    .command('build <src>', 'build HTML from supplied source directory')
    //.option('-b, --build', 'build html')
    //.arguments('<cmd> [src] [dest]', 'build HTML from supplied source folder')
    //.action(function(srcFolder, command){
        //src = srcFolder;
      //  console.log(command.args[0]);
        //destFolder = dest;
    //})
    .parse(process.argv);
