const { REST, Routes } = require('discord.js');
const config = require('../config/config');
const TicketManager = require('../models/Ticket');
const Logger = require('../utils/logger');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`${config.BOT_NAME} đã sẵn sàng! Đăng nhập với tư cách: ${client.user.tag}`);
    client.user.setActivity(`${config.BOT_NAME} | /setup panel`, { type: 'LISTENING' });

    client.guilds.cache.forEach(guild => {
      if (guild.id !== config.ALLOWED_GUILD_ID) {
        console.log(`Rời guild không cho phép: ${guild.id}`);
        guild.leave().catch(console.error);
      }
    });

    const allowedGuild = client.guilds.cache.get(config.ALLOWED_GUILD_ID);
    if (allowedGuild) {
      TicketManager.migrateLegacyTickets(allowedGuild);
      const syncedCount = TicketManager.syncOpenTickets(allowedGuild);
      if (syncedCount > 0) {
        console.log(`Đã đồng bộ ${syncedCount} ticket mở khi channel đã bị xóa.`);
      }
    }

    try {
      const rest = new REST({ version: '10' }).setToken(config.TOKEN);
      const data = await rest.put(
        Routes.applicationGuildCommands(config.CLIENT_ID, config.ALLOWED_GUILD_ID),
        { body: client.commandList || [] }
      );
      console.log(`Đã cập nhật ${data.length} lệnh slash`);
    } catch (error) {
      Logger.error('Lỗi khi đồng bộ lệnh slash: ' + error.message);
    }
  }
};
