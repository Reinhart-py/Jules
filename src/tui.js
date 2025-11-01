const term = require( 'terminal-kit' ).terminal ;
const { connectToWhatsApp, checkNumbers } = require('./whatsapp');
const fs = require('fs');
const { getConfig, saveConfig } = require('../lib/config-manager');
const { importNumbers, exportResults } = require('../lib/file-handler');

const sessions = {};
let results = [];

function terminate() {
	term.grabInput( false ) ;
	setTimeout( function() { process.exit() } , 100 ) ;
}

term.on( 'key' , function( name , matches , data ) {
	if ( name === 'CTRL_C' ) { terminate() ; }
} ) ;

async function mainMenu() {
  term.clear() ;
  term.cyan( 'Jules Checker\n' ) ;
  term.yellow( '<Made by Reinhart - https://reinhart.pages.dev/>\n' ) ;

  const items = [
    'Start Checker' ,
    'Add Session' ,
    'Bulk Message' ,
    'Import Numbers' ,
    'Export Results' ,
    'Settings' ,
    'Quit'
  ] ;

  const response = await term.singleColumnMenu( items ).promise;

  switch(response.selectedIndex) {
    case 0: // Start Checker
      await startChecker();
      break;
    case 1: // Add Session
      await addSession();
      break;
    case 2: // Bulk Message
      await bulkMessage();
      break;
    case 3: // Import Numbers
      await importNumbersPrompt();
      break;
    case 4: // Export Results
      await exportResultsPrompt();
      break;
    case 5: // Settings
      await settingsPrompt();
      break;
    case 6: // Quit
      terminate();
      break;
  }
  term.singleLineMenu(['Back to menu'], () => mainMenu());
}

async function settingsPrompt() {
  const config = getConfig();
  term.cyan(`\nCurrent Country Code: ${config.countryCode}`);
  term.cyan(`\nCurrent Total Digits: ${config.totalDigits}\n`);

  term('Do you want to edit the settings?\n');
  const confirm = await term.singleColumnMenu(['Yes', 'No']).promise;

  if (confirm.selectedIndex === 0) {
    term('Enter new country code (e.g., 1 for US, 91 for India): ');
    const countryCode = await term.inputField({ default: config.countryCode }).promise;

    term('Enter new total digits (e.g., 10 for US numbers): ');
    const totalDigits = await term.inputField({ default: config.totalDigits.toString() }).promise;

    saveConfig({ countryCode, totalDigits: parseInt(totalDigits, 10) });
    term.green('\nSettings saved.');
  }
}

mainMenu();