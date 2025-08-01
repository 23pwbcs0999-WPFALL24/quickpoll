// helpers/tokenGenerator.js
const { v4: uuidv4 } = require('uuid');

function generateTokens(count) {
  return Array.from({ length: count }, () => uuidv4());
}

module.exports = { generateTokens };
