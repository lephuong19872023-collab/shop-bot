require('dotenv').config();

module.exports = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  SETLOG_CHANNEL: process.env.SETLOG_CHANNEL,
  STAFF_ROLE: process.env.STAFF_ROLE,
  BOT_NAME: 'Lonely So VN',
  
  // Staff settings
  MAX_STAFF_ROLES: 3,
  MAX_TICKETS_PER_USER: 1,
  
  // Only allow one server
  ALLOWED_GUILD_ID: process.env.GUILD_ID || '1478689570030616697',
  
  // Products - Giá trong Discord / Giá mua ở shop
  PRODUCTS: [
    { id: 'decor_66_79k', name: 'decor 66k / 79k vnđ', discordPrice: '66k / 79k vnđ', shopPrice: '37k' },
    { id: 'decor_79_105k', name: 'decor 79k / 105k vnđ', discordPrice: '79k / 105k vnđ', shopPrice: '51k' },
    { id: 'decor_105_131k', name: 'decor 105k / 131k vnđ', discordPrice: '105k / 131k vnđ', shopPrice: '75k' },
    { id: 'decor_118_136k', name: 'decor 118k / 136k vnđ', discordPrice: '118k / 136k vnđ', shopPrice: '81k' },
    { id: 'decor_131_146k', name: 'decor 131k / 146k vnđ', discordPrice: '131k / 146k vnđ', shopPrice: '101k' },
    { id: 'decor_141_189k', name: 'decor 141k / 189k vnđ', discordPrice: '141k / 189k vnđ', shopPrice: '115k' }
  ]
};
