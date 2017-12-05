/**
    This file contains several useful functions for managing html documents,
    markdown documents and html documents in DocumentObjectModel form
*/
const fs = require('fs-extra');
const htmlparser = require('htmlparser2');
const marked = require('marked');

/**
  For reference:
  html object represented using DOM:
    type, name, attribs, children, list of children
    next, prev, parent
 */


// set marked.js configuration
marked.setOptions({
    highlight: function (code) {
        return require('highlight.js').highlightAuto(code).value;
    }
});

/**
  This function takes a file from the source directory and parses it into
  html code.
   */
module.exports.markdownToHtml = async function markdownToHtml(srcDir) {
    // data is the contents of the file found at srcPath
    const data = await fs.readFile(srcDir);
    // The markdown file converted into the html file
    return marked(data.toString());

};


/** convert dom to html */
module.exports.domToHtml = function domToHtml(dom){
    return htmlparser.DomUtils.getInnerHTML({ children: dom});
};


/** convert html to dom */
module.exports.htmlToDom = function htmlToDom(html){
    return htmlparser.parseDOM(html);
};


/**
  Make a DOM (childDom) a child of a DOM element (parent)

  If the parent already has children, the new child is appended to the list
  of existing children
*/
module.exports.makeDomChild = function makeDomChild(parent, childDom){
    parent.children = (parent.children).concat(childDom);
    // Ensure that all children point to the correct parent
    let head = childDom;
    while(head !== null && head !== undefined){
        head.parent = parent;
        head = head.next;
    }
};
