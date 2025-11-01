
const blessed = require('blessed');
const { exportResults } = require('../../lib/file-handler');

module.exports = (screen, menu, logViewer, results) => {
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
  const filePathInput = blessed.textbox({
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
  const backButton = blessed.button({ parent: exportForm, name: 'back', content: 'Back', top: 18, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  menu.on('select', (item) => {
    if (item.getText() === 'Export Results') {
      if (results.length === 0) {
        logViewer.log('No results to export. Please run the checker first.');
        return;
      }
      exportForm.show();
      filePathInput.focus();
      screen.render();
    }
  });

  exportButton.on('press', () => {
    const filePath = filePathInput.getValue();
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

  backButton.on('press', () => {
    exportForm.hide();
    screen.render();
  });
};
