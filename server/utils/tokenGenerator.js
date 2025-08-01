function generateTokens(count) {
  const tokens = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < count; i++) {
    let token = '';
    for (let j = 0; j < 8; j++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    tokens.push(token);
  }
  return tokens;
}

module.exports = { generateTokens };
