const readline = require('readline-sync');
const generateCode = require('./generateCode');
const createTemplate = require('./createTemplate');
const scanDir = require('./scanDir');

// Start point of the program
console.log('-------- Zappy - boilerplate code generator --------');

const options = [
    'Generate boilerplate code',
    'Create new template (CLI)',
    'Create new template (scan current directory)'
];

const option = readline.keyInSelect(options, 'Select any option');

if (option == 0) {
    generateCode();
} else if (option == 1) {
    createTemplate();
} else if (option == 2) {
    scanDir();
}