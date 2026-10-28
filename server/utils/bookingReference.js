const crypto = require('crypto');

function generateBookingReference() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `IMV-${dateStr}-${randomChars}`;
}

module.exports = { generateBookingReference };
