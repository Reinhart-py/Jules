
const blessed = require('blessed');
const { importNumbers } = require('../../lib/file-handler');

module.exports = (screen, menu, logViewer) => {
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
  const backButton = blessed.button({ parent: importForm, name: 'back', content: 'Back', top: 5, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  menu.on('select', (item) => {
    if (item.getText() === 'Import Numbers') {
      importForm.show();
      filePathInput.focus();
      screen.render();
    }
  });

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

  backButton.on('press', () => {
    importForm.hide();
    screen.render();
  });
};
