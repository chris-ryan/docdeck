/**
  This program provides the necessary functionality to generate HTML files
  from markdown files. This program is intended to be used to generate documentation
  for the diabCRE knowledgebase

  This file makes use of the files located in server/init files for css
  and server/base1 2 3 for the html boilerplate.
 */

const fs = require('fs-extra');
const htmlparser = require('htmlparser2');
const path = require('path');
const program = require('commander');
const file = require('./file-management');
const html = require('./html-management');
const simpleGit = require('simple-git');


// We name the destination folder here (relative to current directory)
// For now, we specify that the program should be placed in the www folder
const destDirName = 'www';
const markdownExt = '.md';
const htmlExt = '.html';
// Specify the locations where the css files can be found
const srcCssDir = 'server/init';
// Location where the css files will be placed in the destination folder
const destCssDir = 'css';
// Location where the template html can be found
const templateHtmlDir = 'server/htmlInit/base.html';

/**
  Naming conventions
    xxxDir === fully qualified path to directory
    xxxDirName === name of directory (filePath not given)

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

// Record the fully qualified path to the source
const srcDir = path.join(currDir, srcDirName);


// run the rest of the program
// In the event of an error, log the error
main().catch((err)=>console.error(err));


// Delete and recreate the folder
// Prompt the user if and only if the folder already exists
async function main(){
    if(!(await file.isDirectory(srcDir))){
        throw new Error("not a valid directory");
    }
    const directoryMade = await file.makeDirectory(destDir);
    // If the new directory has been created
    if(directoryMade){
        // scan src for html files and parse them into css
        await scanFolder(srcDir, destDir);
        // Copy over the necessary css files
        copyCss(srcCssDir, destCssDir);
    }
}

// Function to copy over the necessary css files into the destination css directory
/**
  The css files will be copied from the source (srcCssDir) to the destination
  (destCssDir) directory
*/
function copyCss(srcCssDir, destCssDir){
    // Copy the css files from local directory to target directory
    const srcDir = path.join(baseDir, srcCssDir);
    const destDir = path.join(destDirName, destCssDir);
    fs.copy(srcDir, destDir, (err)=> {
        if(err){
            throw err;
        }
    });
}

/**
  Scan and clone a given folder, converting all md files to html.
  srcDir - directory where the source files can be located
  destDir - directory where destination files should be placed
*/
async function scanFolder(srcDir, destDir, dirOffset = "") {
    // Function returns a list of items in the current directory
    const dirList = await fs.readdir(srcDir);
    // Handle each file one by one
    dirList.forEach(async function scanFile(fileName){
        // Determine the relative path to this file from the location where this
        // program was called from
        const srcFileDir = path.join(srcDir, fileName);
        const destFileDir = path.join(destDir, fileName);
        const stat = await fs.stat(srcFileDir);
        // If the file is a directory,
        if (stat && stat.isDirectory()) {
            // Create a directory in destination subfolder and scan files in
            fs.mkdirSync(destFileDir);
            const newCssOffset = "../" + dirOffset;
            await scanFolder(srcFileDir, destFileDir, newCssOffset);
        }
        else if (path.extname(fileName) === markdownExt) {
            // Scan the file to the corresponding location in the destination
            // but the with file ext changed to md
            const newDestFileDir = file.replaceExt(destFileDir, htmlExt);
            await processMdFile(srcFileDir, newDestFileDir, dirOffset);
        }
        else {
            // File does not have the markdown extension and is not a folder
            console.log("Warning: " + srcFileDir + " will be ignored");
        }
    });
}

/**
    This function allows the user to convert an md file into a html file.
    The html file will be generated using a template file defined in
    htmlInit/base.html, referencing css files in a specified location
    This is done in 4 steps
    1) Generate boilerplate + css (templateDom)
    2) generate mdDocs
    3) Generate git log history
    4) write the file to destination
 */
async function processMdFile(srcDir, destDir, dirOffset){
    // Generate outer template Dom with css link
    const templateDom = await getTemplateDom(dirOffset);

    // Generate the documentation as a DOM object
    const docs = html.htmlToDom(await html.markdownToHtml(srcDir,destDir));
    // Make the documentation a child of the main body
    const body = htmlparser.DomUtils.getElementById("main-content", templateDom);
    html.makeDomChild(body, docs);

    // Generate the git history as a table
    const htmlTable = await getGitHistoryAsHtmlDom(srcDir);
    // Make the git history a chil of the footer
    const footer = htmlparser.DomUtils.getElementsByTagName("footer", templateDom)[0];
    html.makeDomChild(footer, htmlTable);

    // Write out the document to the destination directory
    const htmlDocs = html.domToHtml(templateDom);
    await fs.createWriteStream(destDir).write(htmlDocs);
}

/**
  Get the git history of a specific directory and
  generate a htmlTable representation in dom form (and return it)
*/
async function getGitHistoryAsHtmlDom(dir){
    // Get a summary of the logs for this dir using simple-git
    let listLogSummary;
    const gitRef = simpleGit(path.parse(dir).dir);
    await gitRef.log({file: path.parse(dir).base },
        (err, lg) => listLogSummary = lg);

    // Create the html table template (as dom object)
    const table = html.htmlToDom("<table></table>");
    // Add the column headers
    const tableHeader = html.htmlToDom(
        `<tr>
            <th> Date </th>
            <th> Message </th>
            <th> Author name </th>
        </tr>`);
    html.makeDomChild(table[0], tableHeader);

    // Add all other log info to DOM table
    const listLogLines = listLogSummary.all;
    for(let i = 0; i < listLogLines.length;i++){
        const listLogLine = listLogLines[i];
        // list log line contains:
        // hash, date, message, author_name, author_email
        const tableLine = html.htmlToDom(
            `<tr>
                <th>`+listLogLine.date         +`</th>
                <th>`+listLogLine.message      +`</th>
                <th>`+listLogLine.author_name  +`</th>
            </tr>`);
        html.makeDomChild(table[0], tableLine);
    }
    return table;
}

/**
   Function designed to generate the documentation boilerplate
   This includes the necessary css and formatting

   This function assumes that the files can be located at the htmlInitDir
*/
function getTemplateDom(dirOffset = './'){
    let domResult;
    // Define the handler to be used in conjunciton with the parser.
    const handler = new htmlparser.DomHandler( function htmlBoilerplateParser(err, dom){
        // Add the corresponding directory offset to the html for css
        const cssLinks = htmlparser.DomUtils.getElementsByTagName("link", dom);
        for(let i = 0;i<cssLinks.length;i++){
            const cssLink = cssLinks[i];
            if(cssLink.attribs.type === 'text/css'){
                cssLink.attribs.href = path.join(dirOffset, cssLink.attribs.href);
            }
        }
        // Add directory offset for script link
        const scriptLinks = htmlparser.DomUtils.getElementsByTagName("script", dom);
        for(let i = 0; i< scriptLinks.length;i++){
            const scriptLink = scriptLinks[i];
            if(scriptLink.attribs.src){
                scriptLink.attribs.src = path.join(dirOffset, scriptLink.attribs.src );
            }
        }

        domResult = dom;
    });
    var parser = new htmlparser.WritableStream(handler);
    // Src refers to the location of the source boilerplate html
    // This can currently be found in server/htmlInit
    const src = path.join(baseDir, templateHtmlDir);
    var fd = fs.createReadStream(src);
    fd.pipe(parser);

    // This returns a promise containing the dom
    // This promise returns when 'end' is triggered
    return new Promise(function(resolve, reject) {
        fd.on('end', ()=>resolve(domResult));
        fd.on('error', reject);
    });
}

/** Note: the functions below are not necessary, but I will keep them here form
possible future use */

// Print out the entire table of contents using a custom parser
// This parser prints out the corresponding entry for tags of type h1 to h3
// This takes in a stream of html data
function printTableOfContents(htmlData){

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
    // Print out the header for each column, before writing out the data
    console.log("row tag header");
    parser.write(htmlData);
    parser.end();
}

// Print out a single row of the table of contents
function printTableOfContentsRow(rowNum, headerTag, headerValue) {
    console.log(rowNum + ": " + headerTag + " " + headerValue);
}
