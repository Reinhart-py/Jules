


const inquirer = require('inquirer');



const fs = require('fs');



const { connectToWhatsApp, checkNumbers } = require('./whatsapp');







console.log('\nJules Checker\n<Made by Reinhart>\n');







const sessions = {};



function showMainMenu() {

  inquirer.prompt([

    {

      type: 'list',

      name: 'command',

      message: 'Select a command',

      choices: ['Start Checker', 'Sessions', 'Import Numbers', 'Export Results', 'Bulk Message', 'Settings', 'Logs', 'Exit'],

    }

  ]).then(async answers => {

    switch (answers.command) {

      case 'Start Checker':

              const sessionNames = Object.keys(sessions);

              if (sessionNames.length === 0) {

                console.log('No active sessions. Please add a session first.');

                showMainMenu();

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

                  default: 1000

                },

                {

                  type: 'input',

                  name: 'limit',

                  message: 'Enter limit (0 for no limit):',

                  default: 0

                }

              ]);

      

              const numbers = fs.readFileSync('numbers.txt', 'utf-8').split('\n').filter(Boolean);

              console.log(`Checking ${numbers.length} numbers with session ${sessionName}...`);

              const results = await checkNumbers(sessions[sessionName], numbers, { delay: parseInt(delay, 10), limit: parseInt(limit, 10) || undefined });

              console.table(results);

              showMainMenu();

              break;

      case 'Sessions':

        showSessionsMenu();

        break;

      case 'Import Numbers':

              const { importPath } = await inquirer.prompt([

                {

                  type: 'input',

                  name: 'importPath',

                  message: 'Enter file path to import numbers from:'

                }

              ]);

              try {

                importNumbers(importPath);

                console.log(`Numbers imported from ${importPath}`);

              } catch (error) {

                console.log(`Error importing numbers: ${error.message}`);

              }

              showMainMenu();

              break;

            case 'Export Results':

              const { exportPath, format, filter } = await inquirer.prompt([

                {

                  type: 'input',

                  name: 'exportPath',

                  message: 'Enter file path to export results to:'

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

                  message: 'Select filter:',

                  choices: ['all', 'valid', 'invalid']

                }

              ]);

              try {

                exportResults(results, exportPath, format, filter);

                console.log(`Results exported to ${exportPath}`);

              } catch (error) {

                console.log(`Error exporting results: ${error.message}`);

              }

              showMainMenu();

              break;

      case 'Bulk Message':
        const { message, sessionName: bulkSessionName } = await inquirer.prompt([
          {
            type: 'input',
            name: 'message',
            message: 'Enter message to send:'
          },
          {
            type: 'list',
            name: 'sessionName',
            message: 'Select a session',
            choices: Object.keys(sessions)
          }
        ]);
        const validNumbers = results.filter(r => r.status === 'valid').map(r => r.number);
        if (validNumbers.length === 0) {
          console.log('No valid numbers to send messages to. Please run the checker first.');
          showMainMenu();
          return;
        }
        console.log(`Sending message to ${validNumbers.length} numbers...`);
        for (const number of validNumbers) {
          await sessions[bulkSessionName].sendMessage(number, { text: message });
        }
        console.log('Bulk message sent.');
        showMainMenu();
        break;
      case 'Settings':
        const config = getConfig();
        console.log(`Current Country Code: ${config.countryCode}`);
        console.log(`Current Total Digits: ${config.totalDigits}`);
        const newConfig = await inquirer.prompt([
          {
            type: 'input',
            name: 'countryCode',
            message: 'Enter new country code:',
            default: config.countryCode
          },
          {
            type: 'input',
            name: 'totalDigits',
            message: 'Enter new total digits:',
            default: config.totalDigits
          }
        ]);
        saveConfig({ countryCode: newConfig.countryCode, totalDigits: parseInt(newConfig.totalDigits, 10) });
        console.log('Settings saved.');
        showMainMenu();
        break;
      case 'Logs':
        console.log('Logs are not yet implemented in the CLI.');
        showMainMenu();
        break;


    }

  });

}



function showSessionsMenu() {

  inquirer.prompt([

    {

      type: 'list',

      name: 'command',

      message: 'Session Management',

      choices: ['List Sessions', 'Add Session', 'Remove Session', 'Back'],

    }

  ]).then(answers => {

    switch (answers.command) {

      case 'List Sessions':

        console.log('Sessions:');

        Object.keys(sessions).forEach(sessionName => console.log(`- ${sessionName}`));

        showSessionsMenu();

        break;

      case 'Add Session':

        inquirer.prompt([

          {

            type: 'input',

            name: 'name',

            message: 'Enter session name:'

          }

        ]).then(async answers => {

          if (answers.name) {

            console.log(`Starting session: ${answers.name}`);

            try {

              const sock = await connectToWhatsApp(answers.name);

              sessions[answers.name] = sock;

              console.log(`Session '${answers.name}' added.`);

            } catch (err) {

              console.log(`Error: ${err.message}`);

            }

          }

          showSessionsMenu();

        });

        break;

      case 'Remove Session':

        inquirer.prompt([

          {

            type: 'list',

            name: 'name',

            message: 'Select a session to remove',

            choices: [...Object.keys(sessions), 'Back']

          }

        ]).then(answers => {

          if (answers.name === 'Back') {

            showSessionsMenu();

            return;

          }

          delete sessions[answers.name];

          console.log(`Session '${answers.name}' removed.`);

          showSessionsMenu();

        });

        break;

      case 'Back':

        showMainMenu();

        break;

    }

  });

}



showMainMenu();
