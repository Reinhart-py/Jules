const blessed = require('blessed');
const { connectToWhatsApp } = require('../whatsapp');

module.exports = (screen, menu, logViewer, sessions) => {
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

  menu.on('select', (item) => {
    if (item.getText() === 'Add Session') {
      addSessionForm.show();
      sessionNameInput.focus();
      screen.render();
    }
  });

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
};