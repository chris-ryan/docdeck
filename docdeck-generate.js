/**
  This program allows a user to

  This is run when the command docdeck generate <template> [dest]
*/

const fs = require('fs-extra');
const path = require('path');
const program = require('commander');

const file = require('./file-management');

const markdownExt = '.md';

/**
  Naming conventions
    xxxDir === fully qualified path to directory
    xxxDirName === name of directory (filePath not given)

    base === directory where this program is located
    curr === directory where this program is being called from
    dest === directory where the html files are to be generated
    src  === directory where the markdown files are located
*/

// Record the current file directory of where the program is being run from
const currDir = process.cwd();
// Record the base directory (location of docdeck-build.js)
const baseDir = path.dirname(require.main.filename);


const templateDirName = 'templates';

var template, dest;
// bring across the commander.js arguments
// <> - required input [] - optional input.
program
    .arguments('<template> [dest]')
    .action(function(temp, des){
        // Record the src file in the global srcDirName variable.
        template = temp;
        dest = des;
    })
    .parse(process.argv);

// Replace the extension with
const srcDirName = file.replaceExt(template, markdownExt);
const destDirName = file.replaceExt(dest, markdownExt);
// Record the fully qualified path to the source
const srcDir = path.join(baseDir, templateDirName, srcDirName);
// Record the path using the current working directory
const destDir = path.join(currDir, destDirName);

// Use immediatly invoked function to make use of await
(async ()=>{
    if(!fs.existsSync(srcDir)){
        throw new Error("Invalid template name");
    }
    if(await file.deleteFile(destDir)){
        fs.copy(srcDir, destDir);
    }}
)().catch((err)=>console.error(err));
