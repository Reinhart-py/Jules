
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qr = require('qrcode-terminal');
const { isValidWhatsAppNumber } = require('../lib/validator');

async function connectToWhatsApp(sessionName) {
  const { state, saveCreds } = await useMultiFileAuthState(`sessions/${sessionName}`);
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr: qrCode } = update;
    if (qrCode) {
      qr.generate(qrCode, { small: true });
    }
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error instanceof Boom) && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
      if (shouldReconnect) {
        connectToWhatsApp(sessionName);
      }
    } else if (connection === 'open') {
      console.log('Opened connection');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  return sock;
}

async function checkNumbers(sock, numbers, options = {}) {
  const { delay = 1000, limit = numbers.length } = options;
  if (delay < 500) {
    console.log('Warning: A very low delay can increase the risk of being banned.');
  }

  const results = [];
  for (let i = 0; i < Math.min(numbers.length, limit); i++) {
    const number = numbers[i];
    if (isValidWhatsAppNumber(number)) {
      try {
        const [result] = await sock.onWhatsApp(number);
        if (result && result.exists) {
          results.push({ number, status: 'valid' });
        } else {
          results.push({ number, status: 'invalid' });
        }
      } catch (error) {
        results.push({ number, status: 'error' });
      }
    } else {
      results.push({ number, status: 'invalid_format' });
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  return results;
}

module.exports = { connectToWhatsApp, checkNumbers };
