const blessed = require('blessed');
const contrib = require('blessed-contrib');
const { connectToWhatsApp, checkNumbers } = require('./whatsapp');
const fs = require('fs');
const { getConfig, saveConfig } = require('../lib/config-manager');
const { importNumbers, exportResults } = require('../lib/file-handler');

const sessions = {};
let results = [];

const screen = blessed.screen({
  smartCSR: true,
  title: 'Jules - WhatsApp Number Checker'
});

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

// Header
grid.set(0, 0, 1, 12, blessed.box, {
  content: '\n\nJules Checker\n<Made by Reinhart>\n',
  align: 'center',
  valign: 'middle',
  style: {
    fg: 'white',
    bg: 'blue'
  }
});

// Menu
const menu = grid.set(1, 0, 11, 3, blessed.list, {
  label: 'Menu',
  keys: true,
  vi: true,
  items: ['Start Checker', 'Add Session', 'Bulk Message', 'Import Numbers', 'Export Results', 'Settings', 'Quit'],
  style: {
    selected: {
      bg: 'blue'
    }
  }
});

// Main Content
const mainContainer = grid.set(1, 3, 11, 9, blessed.box, {
  label: 'Content'
});

// Log Viewer
const logViewer = grid.set(9, 3, 3, 9, contrib.log, {
  label: 'Logs',
  fg: "green",
});

// Results Table
const resultsTable = grid.set(1, 3, 8, 9, contrib.table, {
  keys: true,
  vi: true,
  label: 'Results',
  columnSpacing: 2,
  columnWidth: [20, 20, 10]
});

// --- FORMS ---

// Add Session Form
const addSessionForm = blessed.form({
    parent: screen,
    label: 'Add Session',
    hidden: true,
    keys: true,
    vi: true,
    width: '50%',
    height: '50%',
    left: 'center',
    top: 'center',
    border: { type: 'line' },
    style: { bg: 'black' }
  });

  blessed.text({ parent: addSessionForm, content: 'Session Name:', top: 2, left: 2 });
  const sessionNameInput = blessed.textbox({
    parent: addSessionForm,
    name: 'name',
    top: 3,
    left: 2,
    height: 1,
    width: '90%',
    keys: true,
    vi: true,
    style: { bg: 'blue' },
    inputOnFocus: true
  });

  const saveButton = blessed.button({ parent: addSessionForm, name: 'save', content: 'Save', top: 5, left: 2, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });
  const backButton = blessed.button({ parent: addSessionForm, name: 'back', content: 'Back', top: 5, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  saveButton.on('press', async () => {
    const sessionName = sessionNameInput.getValue();
    if (sessionName) {
      logViewer.log(`Starting session: ${sessionName}`);
      addSessionForm.hide();
      screen.render();
      try {
        const sock = await connectToWhatsApp(sessionName);
        sessions[sessionName] = sock;
        logViewer.log(`Session '${sessionName}' added.`);
      } catch (err) {
        logViewer.log(`Error: ${err.message}`);
      }
    }
  });

  backButton.on('press', () => {
    addSessionForm.hide();
    screen.render();
  });

const checkerOptionsForm = blessed.form({
    parent: screen,
    label: 'Checker Options',
    hidden: true,
    keys: true,
    vi: true,
    width: '50%',
    height: '50%',
    left: 'center',
    top: 'center',
    border: { type: 'line' },
    style: { bg: 'black' }
  });

  blessed.text({ parent: checkerOptionsForm, content: 'Delay (ms):', top: 2, left: 2 });
  const delayInput = blessed.textbox({
    parent: checkerOptionsForm,
    name: 'delay',
    top: 3,
    left: 2,
    height: 1,
    width: '90%',
    keys: true,
    vi: true,
    style: { bg: 'blue' },
    inputOnFocus: true,
    value: '1000'
  });

  blessed.text({ parent: checkerOptionsForm, content: 'Limit:', top: 5, left: 2 });
  const limitInput = blessed.textbox({
    parent: checkerOptionsForm,
    name: 'limit',
    top: 6,
    left: 2,
    height: 1,
    width: '90%',
    keys: true,
    vi: true,
    style: { bg: 'blue' },
    inputOnFocus: true,
    value: '0'
  });

  const startCheckButton = blessed.button({ parent: checkerOptionsForm, name: 'start', content: 'Start', top: 8, left: 2, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });
  const backButton_checker = blessed.button({ parent: checkerOptionsForm, name: 'back', content: 'Back', top: 8, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  startCheckButton.on('press', async () => {
    const delay = parseInt(delayInput.getValue(), 10);
    const limit = parseInt(limitInput.getValue(), 10) || undefined;
    const sessionNames = Object.keys(sessions);
    const sessionPrompt = blessed.list({
      parent: screen,
      top: 'center',
      left: 'center',
      width: 'half',
      height: 'shrink',
      label: 'Select a session',
      items: sessionNames,
      keys: true,
      vi: true,
      style: { selected: { bg: 'blue' } }
    });

    sessionPrompt.on('select', async (item) => {
      const sessionName = item.getText();
      sessionPrompt.destroy();
      checkerOptionsForm.hide();
      screen.render();
      const numbers = fs.readFileSync('numbers.txt', 'utf-8').split('\n').filter(Boolean);
      logViewer.log(`Checking ${numbers.length} numbers with session ${sessionName}...`);
      results = await checkNumbers(sessions[sessionName], numbers, { delay, limit });
      const data = results.map(r => [r.number, r.status]);
      resultsTable.setData({ headers: ['Number', 'Status'], data });
      screen.render();
    });
    sessionPrompt.focus();
    screen.render();
  });

  backButton_checker.on('press', () => {
    checkerOptionsForm.hide();
    screen.render();
  });

const bulkMessageForm = blessed.form({
    parent: screen,
    label: 'Bulk Message',
    hidden: true,
    keys: true,
    vi: true,
    width: '50%',
    height: '50%',
    left: 'center',
    top: 'center',
    border: { type: 'line' },
    style: { bg: 'black' }
  });

  blessed.text({ parent: bulkMessageForm, content: 'Message:', top: 2, left: 2 });
  const messageInput = blessed.textbox({
    parent: bulkMessageForm,
    name: 'message',
    top: 3,
    left: 2,
    height: 1,
    width: '90%',
    keys: true,
    vi: true,
    style: { bg: 'blue' },
    inputOnFocus: true
  });

  const sendMessageButton = blessed.button({ parent: bulkMessageForm, name: 'send', content: 'Send', top: 5, left: 2, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });
  const backButton_bulk = blessed.button({ parent: bulkMessageForm, name: 'back', content: 'Back', top: 5, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  sendMessageButton.on('press', async () => {
    const message = messageInput.getValue();
    const validNumbers = results.filter(r => r.status === 'valid').map(r => r.number);
    const sessionNames = Object.keys(sessions);
    const sessionPrompt = blessed.list({
      parent: screen,
      top: 'center',
      left: 'center',
      width: 'half',
      height: 'shrink',
      label: 'Select a session',
      items: sessionNames,
      keys: true,
      vi: true,
      style: { selected: { bg: 'blue' } }
    });

    sessionPrompt.on('select', async (item) => {
      const sessionName = item.getText();
      sessionPrompt.destroy();
      bulkMessageForm.hide();
      screen.render();
      logViewer.log(`Sending message to ${validNumbers.length} numbers...`);
      for (const number of validNumbers) {
        try {
          await sessions[sessionName].sendMessage(number, { text: message });
          logViewer.log(`Message sent to ${number}`);
        } catch (error) {
          logViewer.log(`Failed to send message to ${number}: ${error.message}`);
        }
      }
      logViewer.log('Bulk message process completed.');
    });
    sessionPrompt.focus();
    screen.render();
  });

  backButton_bulk.on('press', () => {
    bulkMessageForm.hide();
    screen.render();
  });

const importForm = blessed.form({
    parent: screen,
    label: 'Import Numbers',
    hidden: true,
    keys: true,
    vi: true,
    width: '50%',
    height: '50%',
    left: 'center',
    top: 'center',
    border: { type: 'line' },
    style: { bg: 'black' }
  });

  blessed.text({ parent: importForm, content: 'File Path:', top: 2, left: 2 });
  const filePathInput = blessed.textbox({
    parent: importForm,
    name: 'filePath',
    top: 3,
    left: 2,
    height: 1,
    width: '90%',
    keys: true,
    vi: true,
    style: { bg: 'blue' },
    inputOnFocus: true
  });

  const importButton = blessed.button({ parent: importForm, name: 'import', content: 'Import', top: 5, left: 2, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });
  const backButton_import = blessed.button({ parent: importForm, name: 'back', content: 'Back', top: 5, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  importButton.on('press', () => {
    const filePath = filePathInput.getValue();
    if (filePath) {
      try {
        importNumbers(filePath);
        logViewer.log(`Numbers imported from ${filePath}`);
      } catch (error) {
        logViewer.log(`Error importing numbers: ${error.message}`);
      }
      importForm.hide();
      screen.render();
    }
  });

  backButton_import.on('press', () => {
    importForm.hide();
    screen.render();
  });

const exportForm = blessed.form({
    parent: screen,
    label: 'Export Results',
    hidden: true,
    keys: true,
    vi: true,
    width: '50%',
    height: '70%',
    left: 'center',
    top: 'center',
    border: { type: 'line' },
    style: { bg: 'black' }
  });

  blessed.text({ parent: exportForm, content: 'File Path:', top: 2, left: 2 });
  const filePathInput_export = blessed.textbox({
    parent: exportForm,
    name: 'filePath',
    top: 3,
    left: 2,
    height: 1,
    width: '90%',
    keys: true,
    vi: true,
    style: { bg: 'blue' },
    inputOnFocus: true
  });

  blessed.text({ parent: exportForm, content: 'Format:', top: 5, left: 2 });
  const formatList = blessed.list({
    parent: exportForm,
    name: 'format',
    top: 6,
    left: 2,
    height: 4,
    width: '90%',
    keys: true,
    vi: true,
    items: ['txt', 'csv', 'xlsx'],
    style: { selected: { bg: 'blue' } }
  });

  blessed.text({ parent: exportForm, content: 'Filter:', top: 11, left: 2 });
  const filterList = blessed.list({
    parent: exportForm,
    name: 'filter',
    top: 12,
    left: 2,
    height: 5,
    width: '90%',
    keys: true,
    vi: true,
    items: ['all', 'valid', 'invalid', 'invalid_format', 'error'],
    style: { selected: { bg: 'blue' } }
  });

  const exportButton = blessed.button({ parent: exportForm, name: 'export', content: 'Export', top: 18, left: 2, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });
  const backButton_export = blessed.button({ parent: exportForm, name: 'back', content: 'Back', top: 18, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  exportButton.on('press', () => {
    const filePath = filePathInput_export.getValue();
    const format = formatList.selected.content;
    const filter = filterList.selected.content;

    if (filePath) {
      try {
        exportResults(results, filePath, format, filter);
        logViewer.log(`Results exported to ${filePath}`);
      } catch (error) {
        logViewer.log(`Error exporting results: ${error.message}`);
      }
      exportForm.hide();
      screen.render();
    }
  });

  backButton_export.on('press', () => {
    exportForm.hide();
    screen.render();
  });

const settingsForm = blessed.form({
    parent: screen,
    label: 'Settings',
    hidden: true,
    keys: true,
    vi: true,
    width: '50%',
    height: '50%',
    left: 'center',
    top: 'center',
    border: { type: 'line' },
    style: { bg: 'black' }
  });

  blessed.text({ parent: settingsForm, content: 'Country Code:', top: 2, left: 2 });
  const countryCodeInput = blessed.textbox({
    parent: settingsForm,
    name: 'countryCode',
    top: 3,
    left: 2,
    height: 1,
    width: '90%',
    keys: true,
    vi: true,
    style: { bg: 'blue' },
    inputOnFocus: true
  });

  blessed.text({ parent: settingsForm, content: 'Total Digits:', top: 5, left: 2 });
  const totalDigitsInput = blessed.textbox({
    parent: settingsForm,
    name: 'totalDigits',
    top: 6,
    left: 2,
    height: 1,
    width: '90%',
    keys: true,
    vi: true,
    style: { bg: 'blue' },
    inputOnFocus: true
  });

  const saveButton_settings = blessed.button({ parent: settingsForm, name: 'save', content: 'Save', top: 8, left: 2, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });
  const backButton_settings = blessed.button({ parent: settingsForm, name: 'back', content: 'Back', top: 8, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  saveButton_settings.on('press', () => {
    const config = {
      countryCode: countryCodeInput.getValue(),
      totalDigits: parseInt(totalDigitsInput.getValue(), 10)
    };
    saveConfig(config);
    logViewer.log('Settings saved.');
    settingsForm.hide();
    screen.render();
  });

  backButton_settings.on('press', () => {
    settingsForm.hide();
    screen.render();
  });

menu.on('select', (item) => {
  const selected = item.getText();
  logViewer.log(`Selected: ${selected}`);

  if (selected === 'Quit') {
    return process.exit(0);
  }

  if (selected === 'Add Session') {
    addSessionForm.show();
    sessionNameInput.focus();
    screen.render();
  }

  if (selected === 'Start Checker') {
    checkerOptionsForm.show();
    delayInput.focus();
    screen.render();
  }

  if (selected === 'Bulk Message') {
    bulkMessageForm.show();
    messageInput.focus();
    screen.render();
  }

  if (selected === 'Import Numbers') {
    importForm.show();
    filePathInput.focus();
    screen.render();
  }

  if (selected === 'Export Results') {
    exportForm.show();
    filePathInput_export.focus();
    screen.render();
  }

  if (selected === 'Settings') {
    const config = getConfig();
    countryCodeInput.setValue(config.countryCode);
    totalDigitsInput.setValue(config.totalDigits.toString());
    settingsForm.show();
    countryCodeInput.focus();
    screen.render();
  }
});

menu.focus();
screen.render();