
const blessed = require('blessed');

module.exports = (screen, menu, logViewer, sessions, results) => {
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
  const backButton = blessed.button({ parent: bulkMessageForm, name: 'back', content: 'Back', top: 5, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  menu.on('select', (item) => {
    if (item.getText() === 'Bulk Message') {
      const validNumbers = results.filter(r => r.status === 'valid');
      if (validNumbers.length === 0) {
        logViewer.log('No valid numbers to send messages to. Please run the checker first.');
        return;
      }

      const sessionNames = Object.keys(sessions);
      if (sessionNames.length === 0) {
        logViewer.log('No active sessions. Please add a session first.');
        return;
      }

      bulkMessageForm.show();
      messageInput.focus();
      screen.render();

      sendMessageButton.on('press', async () => {
        const message = messageInput.getValue();
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
              await sessions[sessionName].sendMessage(number.number, { text: message });
              logViewer.log(`Message sent to ${number.number}`);
            } catch (error) {
              logViewer.log(`Failed to send message to ${number.number}: ${error.message}`);
            }
          }
          logViewer.log('Bulk message process completed.');
        });
        sessionPrompt.focus();
        screen.render();
      });

      module.exports.test = async (sessionName, message) => {
    const validNumbers = results.filter(r => r.status === 'valid').map(r => r.number);
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
  };
    }
  });
};
