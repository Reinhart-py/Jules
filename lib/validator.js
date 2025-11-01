
const { getConfig } = require('./config-manager');

function formatNumber(number) {
  const config = getConfig();
  let formattedNumber = number.replace(/\D/g, ''); // Remove non-digits
  if (formattedNumber.length === config.totalDigits) {
    formattedNumber = `${config.countryCode}${formattedNumber}`;
  }
  if (!formattedNumber.startsWith('+')) {
    formattedNumber = `+${formattedNumber}`;
  }
  return formattedNumber;
}

function isValidWhatsAppNumber(number) {
  const formattedNumber = formatNumber(number);
  const regex = /^\+[0-9]{10,15}$/;
  return regex.test(formattedNumber);
}

module.exports = { isValidWhatsAppNumber, formatNumber };
