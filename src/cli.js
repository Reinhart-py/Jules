const inquirer = require('inquirer');
const fs = require('fs');
const { connectToWhatsApp, checkNumbers } = require('./whatsapp');
const { getConfig, saveConfig } = require('../lib/config-manager');
const { importNumbers, exportResults } = require('../lib/file-handler');

const sessions = {};
let results = [];

function showHeader() {
  console.clear();
  const header = `
  ██╗██╗   ██╗██╗     ███████╗███████╗
  ██║██║   ██║██║     ██╔════╝██╔════╝
  ██║██║   ██║██║     █████╗  ███████╗
  ██║██║   ██║██║     ██╔══╝  ╚════██║
  ██║╚██████╔╝███████╗███████╗███████║
  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝
         C H E C K E R
  < by Reinhart - https://reinhart.pages.dev/ >
  `;
  console.log(header);
}

async function mainMenu() {
  showHeader();
  const { command } = await inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Select a command',
      choices: ['Start Checker', 'Sessions', 'Bulk Message', 'Import Numbers', 'Export Results', 'Settings', 'Quit'],
    }
  ]);

  switch (command) {
    case 'Start Checker':
      await startChecker();
      break;
    case 'Sessions':
      await showSessionsMenu();
      break;
    case 'Bulk Message':
      await bulkMessage();
      break;
    case 'Import Numbers':
      await importNumbersPrompt();
      break;
    case 'Export Results':
      await exportResultsPrompt();
      break;
    case 'Settings':
      await settingsPrompt();
      break;
    case 'Quit':
      return;
  }
  await inquirer.prompt({ type: 'input', name: 'continue', message: 'Press Enter to continue...' });
  mainMenu();
}

async function startChecker() {
  const sessionNames = Object.keys(sessions);
  if (sessionNames.length === 0) {
    console.log('No active sessions. Please add a session first.');
    return;
  }

  const { sessionName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'sessionName',
      message: 'Select a session',
      choices: sessionNames
    }
  ]);

  const { delay, limit } = await inquirer.prompt([
    {
      type: 'input',
      name: 'delay',
      message: 'Enter delay (ms):',
      default: 1000,
      validate: input => !isNaN(input) && parseInt(input) >= 0 ? true : 'Please enter a valid number.'
    },
    {
      type: 'input',
      name: 'limit',
      message: 'Enter limit (0 for no limit):',
      default: 0,
      validate: input => !isNaN(input) && parseInt(input) >= 0 ? true : 'Please enter a valid number.'
    }
  ]);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Start checker with session '${sessionName}', delay ${delay}ms, limit ${limit === 0 ? 'no limit' : limit}?`,
      default: true
    }
  ]);

  if (confirm) {
    const numbers = fs.readFileSync('numbers.txt', 'utf-8').split('\n').filter(Boolean);
    console.log(`Checking ${numbers.length} numbers with session ${sessionName}...`);
    results = await checkNumbers(sessions[sessionName], numbers, { delay: parseInt(delay, 10), limit: parseInt(limit, 10) || undefined });
    console.table(results);
  }
}

async function showSessionsMenu() {
  showHeader();
  const { command } = await inquirer.prompt([
    {
      type: 'list',
      name: 'command',
      message: 'Session Management',
      choices: ['List Sessions', 'Add Session', 'Remove Session', 'Back'],
    }
  ]);

  switch (command) {
    case 'List Sessions':
      console.log('Sessions:');
      Object.keys(sessions).forEach(sessionName => console.log(`- ${sessionName}`));
      break;
    case 'Add Session':
      const { name } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter session name:',
          validate: input => input.length > 0 ? true : 'Session name cannot be empty.'
        }
      ]);
      if (name) {
        console.log(`Starting session: ${name}`);
        try {
          const sock = await connectToWhatsApp(name);
          sessions[name] = sock;
          console.log(`Session '${name}' added.`);
        } catch (err) {
          console.log(`Error: ${err.message}`);
        }
      }
      break;
    case 'Remove Session':
      const sessionNames = Object.keys(sessions);
      if (sessionNames.length === 0) {
        console.log('No sessions to remove.');
        break;
      }
      const { nameToRemove, confirmRemove } = await inquirer.prompt([
        {
          type: 'list',
          name: 'nameToRemove',
          message: 'Select a session to remove',
          choices: sessionNames
        },
        {
          type: 'confirm',
          name: 'confirmRemove',
          message: 'Are you sure you want to remove this session?',
          default: false
        }
      ]);
      if (confirmRemove) {
        delete sessions[nameToRemove];
        console.log(`Session '${nameToRemove}' removed.`);
      }
      break;
    case 'Back':
      return;
  }
  await inquirer.prompt({ type: 'input', name: 'continue', message: 'Press Enter to continue...' });
  showSessionsMenu();
}

async function bulkMessage() {
  const validNumbers = results.filter(r => r.status === 'valid').map(r => r.number);
  if (validNumbers.length === 0) {
    console.log('No valid numbers to send messages to. Please run the checker first.');
    return;
  }

  const sessionNames = Object.keys(sessions);
  if (sessionNames.length === 0) {
    console.log('No active sessions. Please add a session first.');
    return;
  }

  const { message, sessionName, confirm } = await inquirer.prompt([
    {
      type: 'input',
      name: 'message',
      message: 'Enter message to send:',
      validate: input => input.length > 0 ? true : 'Message cannot be empty.'
    },
    {
      type: 'list',
      name: 'sessionName',
      message: 'Select a session to send from:',
      choices: sessionNames
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: `Send message to ${validNumbers.length} valid numbers using session '${sessionName}'?`,
      default: true
    }
  ]);

  if (confirm) {
    console.log(`Sending message to ${validNumbers.length} numbers...`);
    for (const number of validNumbers) {
      try {
        await sessions[sessionName].sendMessage(number, { text: message });
        console.log(`Message sent to ${number}`);
      } catch (error) {
        console.log(`Failed to send message to ${number}: ${error.message}`);
      }
    }
    console.log('Bulk message process completed.');
  }
}

async function importNumbersPrompt() {
  const { importPath, confirm } = await inquirer.prompt([
    {
      type: 'input',
      name: 'importPath',
      message: 'Enter file path to import numbers from (e.g., numbers.txt):',
      validate: input => fs.existsSync(input) ? true : 'File does not exist.'
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to import numbers from this file? This will overwrite existing numbers.',
      default: false
    }
  ]);

  if (confirm) {
    try {
      importNumbers(importPath);
      console.log(`Numbers imported from ${importPath}`);
    } catch (error) {
      console.log(`Error importing numbers: ${error.message}`);
    }
  }
}

async function exportResultsPrompt() {
  if (results.length === 0) {
    console.log('No results to export. Please run the checker first.');
    return;
  }

  const { exportPath, format, filter, confirm } = await inquirer.prompt([
    {
      type: 'input',
      name: 'exportPath',
      message: 'Enter file path to export results to (e.g., results.csv):',
      validate: input => input.length > 0 ? true : 'File path cannot be empty.'
    },
    {
      type: 'list',
      name: 'format',
      message: 'Select export format:',
      choices: ['txt', 'csv', 'xlsx']
    },
    {
      type: 'list',
      name: 'filter',
      message: 'Select filter for results:',
      choices: ['all', 'valid', 'invalid', 'invalid_format', 'error']
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to export the results?',
      default: true
    }
  ]);

  if (confirm) {
    try {
      exportResults(results, exportPath, format, filter);
      console.log(`Results exported to ${exportPath}`);
    } catch (error) {
      console.log(`Error exporting results: ${error.message}`);
    }
  }
}

async function settingsPrompt() {
  const config = getConfig();
  console.log(`Current Country Code: ${config.countryCode}`);
  console.log(`Current Total Digits: ${config.totalDigits}`);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to edit the settings?',
      default: false
    }
  ]);

  if (confirm) {
    const newConfig = await inquirer.prompt([
      {
        type: 'input',
        name: 'countryCode',
        message: 'Enter new country code (e.g., 1 for US, 91 for India):',
        default: config.countryCode,
        validate: input => !isNaN(input) && parseInt(input) > 0 ? true : 'Please enter a valid country code.'
      },
      {
        type: 'input',
        name: 'totalDigits',
        message: 'Enter new total digits (e.g., 10 for US numbers):',
        default: config.totalDigits.toString(),
        validate: input => !isNaN(input) && parseInt(input) > 0 ? true : 'Please enter a valid number of digits.'
      }
    ]);
    saveConfig({ countryCode: newConfig.countryCode, totalDigits: parseInt(newConfig.totalDigits, 10) });
    console.log('Settings saved.');
  }
}

mainMenu();