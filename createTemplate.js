const fs = require('fs');
const { dirname } = require('path');
const path = require('path');
const readline = require('readline-sync');

// Function to create a template from within the CLI
const createTemplate = () => {
    console.log('Enter -1 to quit');
    // Template name
    const name = readline.question('\nEnter template name: ');
    if (name == '-1') return;
    let fileName, fileCode;
    let program = [], code = [];

    // Add each file to list of files required by the template
    while (true) {
        // Input file names
        fileName = readline.question('Enter file name: ');
        if (fileName.trim() == '-1') break;
        console.log('Enter code: ');
        while (true) {
            // Input code
            fileCode = readline.question('', {
                keepWhitespace: true
            });
            if (fileCode.trim() == '-1') break;
            code.push(fileCode);
        }
        // Add file and code to program array
        program.push({
            file: fileName,
            code: code
        });
        // Reset code for next file
        code = [];
        console.log();
    }

    if (program.length > 0) {
        try {
            let fileString = fs.readFileSync(path.join(__dirname, 'boilerplateCode.json'));
            let fileList = JSON.parse(fileString);
            // Add new template to existing templates
            fileList.push({
                name: name,
                program: program
            });
            fs.writeFileSync(path.join(__dirname, 'boilerplateCode.json'), JSON.stringify(fileList, null, 4));
            console.log('\nTemplate created successfully!');
        } catch (err) {
            console.log(err.message);
        }
    } else {
        console.log('\nNo template created!');
    }
}

module.exports = createTemplate;