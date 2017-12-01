/**
  This program provides the necessary functionality to generate HTML files
  from markdown files. This program is intended to be used to generate documentation
  for the diabCRE knowledgebase

  This file makes use of the files located in server/init files for css
  and server/base1 2 3 for the html boilerplate.
 */

const fs = require('fs-extra');
const htmlparser = require('htmlparser2');
// marked provides a function that parses html and converts it into markdown
const marked = require('marked');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer');

// We name the destination folder here (relative to current directory)
// For now, we specify that the program should be placed in the www folder
const destDirName = 'www';
const htmlExt = '.html';
const markdownExt = '.md';
const srcCssDir = 'server/init';
const destCssDir = 'css';

/**
  Naming conventions
    xxxDir === full path to directory
    xxxDirName === name of directory

    base === directory where this program is located
    curr === directory where this program is being called from
    dest === directory where the html files are to be generated
    src  === directory where the markdown files are located
*/

// Define the name of the directory used as the source
var srcDirName;
// Record the current file directory of where the program is being run from
const currDir = process.cwd();
// Record the base directory (location of docdeck-build.js)
const baseDir = path.dirname(require.main.filename);
// Record the path using the current working directory
const destDir = path.join(currDir, destDirName);

// bring across the commander.js arguments
// <> - required input [] - optional input.
program
    .arguments('<src>')
    .action(function(src){
        // Record the src file in the global srcDirName variable.
        srcDirName = src;
    })
    .parse(process.argv);

// set marked.js configuration
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

// run the rest of the program
main();

// Delete and recreate the folder
// Prompt the user if and only if the folder already exists
async function main(){

    if(!isDirectory(srcDirName)){
        console.error("not a valid directory");
    }

    const directoryMade = await makeDirectory(destDir);
    // If the new directory has been created
    if(directoryMade){
        copyCss(srcCssDir, destCssDir);
        buildHtmlFilesFromMarkdown(srcDirName);
    }
}

// Function to create a new directory
async function makeDirectory(destDir){
    const destDirName = path.parse(destDir).name;
    if (fs.existsSync(destDir)) {
        const question = {
            message: "Warning: you are about to delete and replace the " + destDirName + " folder.\n"+
                            "are you sure you want to continue?",
            type:"confirm",
            name:"continue"
        };
        const response = await inquirer.prompt(question);
        if(response.continue){
            fs.removeSync(destDir);
            fs.mkdirSync(destDir);
            return true;
        }else{
            return false;
        }

    }else{
        fs.mkdirSync(destDir);
        return true;
    }
}

// Function to copy over the necessary css files into the destination css directory
function copyCss(srcCssDir, destCssDir){
    // Copy the css files from local directory to target directory
    fs.copy(path.join(baseDir, srcCssDir), path.join(destDirName, destCssDir), (err)=> {
        if(err){
            throw err;
        }
    });
}

// Build the html files from given markdown files
function buildHtmlFilesFromMarkdown(src){
    // scan src for html files and parse them into css
    scanFolder(src, function(err, results){
        if (err) throw err;
        console.log(results);
    });

}


// Print out a single row of the table of contents
function printTableOfContentsRow(rowNum, headerTag, headerValue) {
    console.log(rowNum + ": " + headerTag + " " + headerValue);
}


// Print out the entire table of contents using a custom parser
// This parser prints out the corresponding entry for tags of type h1 to h3
function makeTOC(htmlData){

    // Use  parser to print out the table of contents
    let rowNum = 0;
    // Define the parser used to parse the data
    var parser = new htmlparser.Parser({
        // Define the behaviour of the parser on seeing an open tag
        onopentag: function(tag, attribs){
            if(tag === "h1" || tag === "h2" || tag === "h3"){
                rowNum++;
                printTableOfContentsRow(rowNum,tag,attribs.id);
            }
        }
    });

    console.log("row tag header");
    parser.write(htmlData);
    parser.end();
}


// Given the relative path of the destination and the baseDirectory, make a page out of the data
// Note, we assume that this file is of type .md and the data is to be stored in destDirName
function makePage(relPath) {

    // Record the file path of the file we wish to output to
    // This outputs the data to the destDirName folder

    // The data in the destDirName folder mirrors the data in the target folder, but
    // contains html files instead of md files.
    const destPath = path.join(destDirName, path.parse(relPath).dir,
        path.parse(relPath).name + htmlExt);
    // copy the data in the server/base.html file into the destination folder
    // Record the complete path to the current file.
    const srcPath = path.join(srcDirName, relPath);
    fs.createReadStream(path.join(baseDir,'server/base.html'))
        .pipe(fs.createWriteStream(destPath));

    // data is the contents of the file found at srcPath
    fs.readFile(srcPath, function(err, data){
        if (err){
            throw err;
        }
        // Append the closing tags that correspond to the open tags
        // found in server/base.html
        const closingTags = "</div></body></html>";
        // The markdown file converted into the html file
        let convertedData = marked(data.toString());
        makeTOC(convertedData);
        // Append the data to the file found at the destination path
        fs.appendFile(destPath, convertedData + closingTags, function(err){
            if (err) {
                throw err;
            }
            console.log("writing to the destination file: " + destPath);
        });
    });
}

// Check if src is a directory
function isDirectory(srcDirName){

    // Check that the name was given
    if (typeof srcDirName === 'undefined'){
        return false;
    }
    fs.stat(srcDirName, function(err, stat){
        // If it is a valid folder, return true
        if (stat && stat.isDirectory()) {
            return true;
        }
    });
    return false;
}

// scan a given directory for file and folders
// New dir refers to the new file location that needs to be created
function scanFolder(folderToScan, done) {
    // read and convert directory
    // Function returns a list of items in the current directory
    fs.readdir(folderToScan, function(err, dirList){
        if (err) return done(err);
        // Handle each file one by one
        dirList.forEach(function(file, index){
            // Convert a series of files into an absolute path
            file = path.resolve(folderToScan, file);
            var relFile = path.relative(srcDirName, file);
            fs.stat(file, function(err, stat){
                // If it is a folder, recurse on the directory
                if (stat && stat.isDirectory()) {
                    console.log("creating directory:" + relFile);
                    fs.mkdirSync(path.join(destDir, relFile));
                    //...recursive call to scanFolder function
                    scanFolder(file, function(err) {
                        if(err){
                            console.error(err);
                        }
                        if (dirList.length === index+1) done();
                    });
                }
                else if (path.extname(file) === markdownExt) {
                    console.log("writing " + relFile);
                    makePage(relFile, currDir);
                    if (dirList.length === index+1) done();
                }
                else {
                    console.log("--ignored--: " + file);
                    if (dirList.length === index+1) done();
                }
            });
        });
    });
}
