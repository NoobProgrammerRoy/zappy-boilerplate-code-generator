const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');

// Function to create template by scanning the current directory
const scanDir = () => {
    console.log('Enter -1 to quit');
    // Template name
    const templateName = readline.question('\nEnter template name: ');
    if (templateName == -1) {
        console.log('\nNo template created');
        return;
    }
    
    // List of files to be ignored
    let ignoredFiles = [];
    while(true) {
        let fileName = readline.question('Enter file/dir to be ignored: ');
        if (fileName == -1) break;
        ignoredFiles.push(fileName);
    }

    // Filter ignored files from file list
    const fileList = fs.readdirSync(__dirname);
    const files = fileList.filter(file => {
        let isRequired = true;
        ignoredFiles.forEach(item => {
            if (item == file) 
                isRequired = false;
        });
        return isRequired;
    });

    // Create template
    let program = [];
    createTemplate(files, program, '');
    
    // Add to main JSON file
    try {
        let templateString = fs.readFileSync(path.join(__dirname, 'boilerplateCode.json'));
        let templateList = JSON.parse(templateString);
        // Add new template to existing templates
        templateList.push({
            name: templateName,
            program: program
        });
        fs.writeFileSync(path.join(__dirname, 'boilerplateCode.json'), JSON.stringify(templateList, null, 4));
        console.log('\nTemplate created successfully!');
    } catch (err) {
        console.log(err.message);
    }
}

// A recursive function which will generate code template
// It checks if each item is a file or directory
// It will generate template for a file
// It will recursively call itself for a directory
// Takes 3 params, files - list of files in a particular directory, 
// program - array of program templates, dir - location of directory
const createTemplate = (files, program, dir) => {
    try {
        files.forEach(file => {
            // For directory
            if (fs.lstatSync(path.join(__dirname, dir, file)).isDirectory()) {
                // Editing here
                const fileList = fs.readdirSync(path.join(__dirname, dir, file));
                // createTemplate(fileList, program, dir + '/' + file);
                createTemplate(fileList, program, dir == '' ? file : dir + '/' + file);
            } 
            // For files
            else {
                let code = fs.readFileSync(path.join(__dirname, dir, file), {
                    encoding: 'utf8'
                });
                program.push({
                    // file: (dir + '/' + file).trim(),
                    file: (dir == '' ? file : dir + '/' + file).trim(),
                    code: code.split('\n')
                });
            }
        });
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = scanDir;