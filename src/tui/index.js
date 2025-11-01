const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen({
  smartCSR: true,
  title: 'Jules - WhatsApp Number Checker'
});

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

const sessions = {};
let results = [];

require('./header')(grid, screen);
const menu = require('./menu')(grid);
require('./main')(grid);
const logViewer = require('./logger')(grid);
const resultsTable = require('./results')(grid);

require('./add-session')(screen, menu, logViewer, sessions);
require('./start-checker')(screen, menu, logViewer, resultsTable, sessions, results);
require('./bulk-message')(screen, menu, logViewer, sessions, results);
require('./import-numbers')(screen, menu, logViewer);
require('./export-results')(screen, menu, logViewer, results);
require('./settings')(screen, menu, logViewer);

screen.key(['q', 'C-c'], (ch, key) => {
  return process.exit(0);
});

screen.key(['tab'], (ch, key) => {
  screen.focusNext();
});

screen.key(['S-tab'], (ch, key) => {
  screen.focusPrevious();
});

menu.focus();
screen.render();