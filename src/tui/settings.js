
const blessed = require('blessed');
const { getConfig, saveConfig } = require('../../lib/config-manager');

module.exports = (screen, menu, logViewer) => {
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

  const saveButton = blessed.button({ parent: settingsForm, name: 'save', content: 'Save', top: 8, left: 2, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });
  const backButton = blessed.button({ parent: settingsForm, name: 'back', content: 'Back', top: 8, left: 15, width: 10, height: 1, style: { bg: 'blue', focus: { bg: 'red' } } });

  menu.on('select', (item) => {
    if (item.getText() === 'Settings') {
      const config = getConfig();
      countryCodeInput.setValue(config.countryCode);
      totalDigitsInput.setValue(config.totalDigits.toString());
      settingsForm.show();
      countryCodeInput.focus();
      screen.render();
    }
  });

  saveButton.on('press', () => {
    const config = {
      countryCode: countryCodeInput.getValue(),
      totalDigits: parseInt(totalDigitsInput.getValue(), 10)
    };
    saveConfig(config);
    logViewer.log('Settings saved.');
    settingsForm.hide();
    screen.render();
  });

  module.exports.test = (countryCode, totalDigits) => {
    const config = {
      countryCode,
      totalDigits: parseInt(totalDigits, 10)
    };
    saveConfig(config);
    logViewer.log('Settings saved.');
  };
};
