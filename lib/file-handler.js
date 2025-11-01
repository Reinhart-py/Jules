
const fs = require('fs');

function importNumbers(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  return data.split('\n').filter(Boolean);
}

function exportResults(results, filePath, format, filter) {
  let filteredResults = results;
  if (filter !== 'all') {
    filteredResults = results.filter(r => r.status === filter);
  }

  let output = '';
  switch (format) {
    case 'txt':
      output = filteredResults.map(r => `${r.number} - ${r.status}`).join('\n');
      break;
    case 'csv':
      output = 'number,status\n' + filteredResults.map(r => `${r.number},${r.status}`).join('\n');
      break;
    case 'xlsx':
      // XLSX export requires a library like 'xlsx'.
      // This is a placeholder.
      console.log('XLSX export is not yet implemented.');
      return;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  fs.writeFileSync(filePath, output);
}

module.exports = { importNumbers, exportResults };
