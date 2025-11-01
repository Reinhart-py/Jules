const inquirer = require('inquirer');
const { spawn } = require('child_process');
const path = require('path');

inquirer.prompt([
    {
        type: 'list',
        name: 'interface',
        message: 'Which interface would you like to use?',
        choices: ['TUI Dashboard', 'Interactive CLI'],
    },
]).then(answers => {
    const scriptPath = answers.interface === 'TUI Dashboard' ? 'src/tui.js' : 'src/cli.js';
    const childProcess = spawn('node', [path.join(__dirname, scriptPath)], { stdio: 'inherit' });
    childProcess.on('exit', (code) => process.exit(code));
});