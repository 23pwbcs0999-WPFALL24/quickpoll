const { v4: uuidv4 } = require('uuid');

function generateTokens(count) {
  return Array.from({ length: count }, () => uuidv4().slice(0, 8)); // Only first 8 chars
}

module.exports = { generateTokens };
