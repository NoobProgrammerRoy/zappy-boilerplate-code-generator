const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline-sync');

// Function to generate boilerplate code using JSON templates
const generateCode = () => {
    // Read all templates as a string
    const templateString = fs.readFileSync(path.join(__dirname, 'boilerplateCode.json'), {
        encoding: 'utf8'
    });
    
    // Convert string into array of templates
    const templateList = JSON.parse(templateString);
    
    // Get names of all templates
    const templateNames = templateList.map(file => file.name); 

    // Select menu for the templates
    const templateIndex = readline.keyInSelect(templateNames, 'Select a template');

    if (templateIndex > -1) {
        // Get required template and its files
        const files = templateList[templateIndex];
    
        const dir = readline.question('Enter project name : ');
        // Generate boilerplate code for the template
        try {
            // Create project directory and change directory to it
            fs.mkdirSync(dir);
            process.chdir(dir);

            // Generate program files from the template 
            files.program.forEach(file => {
                // If files are contained within sub-directories
                let fileDir = file.file.split('/');
                if (fileDir.length > 1) {
                    // Creating the required sub-directories, if not existing
                    for (let i = 0; i < fileDir.length - 1; i++) {
                        if (!fs.existsSync(path.join(process.cwd(), fileDir[i])))
                            fs.mkdirSync(fileDir[i]);
                        // Change to sub-directory
                        process.chdir(fileDir[i]);
                    }
                    fs.writeFileSync(path.join(process.cwd(), fileDir[fileDir.length - 1]), file.code.join('\n'));
                    // Locate back to original project directory
                    for (let i = 0; i < fileDir.length - 1; i++) {
                        process.chdir('../');
                    }
                } else {
                    fs.writeFileSync(path.join(process.cwd(), file.file), file.code.join('\n'));
                }
            });
            console.log('\nBoilerplate code successfully generated!');
        } catch (err) {
            console.log(err.message);
        }
    } else {
        console.log('\nNo boilerplate code generated!');
    }
}

module.exports = generateCode;