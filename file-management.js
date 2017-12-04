/**
  This folder contains a number of helpful functions
 */


const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
/** Change a directory extension to md */
module.exports.replaceExt = function replaceExt(dir, ext){
    var pathString = path.parse(dir);
    pathString.ext = ext;
    // base must be set to null so that the right ext is used in path.format()
    pathString.base = null;
    return path.format(pathString);
};


// Function to create a new directory
module.exports.makeDirectory = async function makeDirectory(destDir){
    const destDirName = path.parse(destDir).name;
    if (fs.existsSync(destDir)) {
        const question = {
            message: "Warning: you are about to delete and replace the "
                            + destDirName + " folder.\n"
                            + "are you sure you want to continue?",
            type:"confirm",
            name:"continue"
        };
        // If the user does not wish to continue, return false to abort
        const response = await inquirer.prompt(question);
        if(response.continue){
            fs.removeSync(destDir);
            fs.mkdirSync(destDir);
            return true;
        }else{
            return false;
        }

    }else{
        // If the directory does not exist, simply create the directory.
        fs.mkdirSync(destDir);
        return true;
    }
};


// Check if a file is a valid directory
module.exports.isDirectory = async function isDirectory(dir){
    // Check that the name was given
    if (typeof dir === 'undefined'){
        return false;
    }
    const stat = await fs.stat(dir);
    // If it is a valid folder, return true
    if (stat && stat.isDirectory()) {
        return true;
    }else{
        return false;
    }
};
