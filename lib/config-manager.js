
const fs = require('fs');

const CONFIG_PATH = 'config.json';

function getConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } else {
    return { countryCode: '1', totalDigits: 10 };
  }
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

module.exports = { getConfig, saveConfig };
