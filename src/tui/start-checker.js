const blessed = require('blessed');
const fs = require('fs');
const { checkNumbers } = require('../whatsapp');

module.exports = (screen, menu, logViewer, resultsTable, sessions, results) => {
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
  const backButton = blessed.button({ parent: checkerOptionsForm, name: 'back', content: 'Back', top: 8, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  menu.on('select', (item) => {
    if (item.getText() === 'Start Checker') {
      const sessionNames = Object.keys(sessions);
      if (sessionNames.length === 0) {
        logViewer.log('No active sessions. Please add a session first.');
        return;
      }

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

      sessionPrompt.on('select', (item) => {
        const sessionName = item.getText();
        sessionPrompt.destroy();
        checkerOptionsForm.show();
        delayInput.focus();
        screen.render();

        startCheckButton.on('press', async () => {
          const delay = parseInt(delayInput.getValue(), 10);
          const limit = parseInt(limitInput.getValue(), 10) || undefined;
          const numbers = fs.readFileSync('numbers.txt', 'utf-8').split('\n').filter(Boolean);
          logViewer.log(`Checking ${numbers.length} numbers with session ${sessionName}...`);
          checkerOptionsForm.hide();
          screen.render();
          results = await checkNumbers(sessions[sessionName], numbers, { delay, limit });
          const data = results.map(r => [r.number, r.status]);
          resultsTable.setData({ headers: ['Number', 'Status'], data });
          screen.render();
        });

        module.exports.test = async (sessionName, delay, limit) => {
    const numbers = fs.readFileSync('numbers.txt', 'utf-8').split('\n').filter(Boolean);
    logViewer.log(`Checking ${numbers.length} numbers with session ${sessionName}...`);
    results = await checkNumbers(sessions[sessionName], numbers, { delay, limit });
    const data = results.map(r => [r.number, r.status]);
    resultsTable.setData({ headers: ['Number', 'Status'], data });
    screen.render();
  };
      });
      sessionPrompt.focus();
      screen.render();
    }
  });
};