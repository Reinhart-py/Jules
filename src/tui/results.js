
const contrib = require('blessed-contrib');

module.exports = (grid) => {
  return grid.set(1, 3, 8, 9, contrib.table, {
    keys: true,
    vi: true,
    label: 'Results',
    columnSpacing: 2,
    columnWidth: [20, 20, 10]
  });
};
