const { SlashCommandBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Gọi staff hỗ trợ')
    .addStringOption(option =>
      option
        .setName('ticket_id')
        .setDescription('ID của ticket')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const ticketId = interaction.options.getString('ticket_id');
    const staffRole = interaction.guild.roles.cache.get(config.STAFF_ROLE);

    if (!staffRole) {
      return interaction.reply({
        content: 'Role staff chưa được cấu hình.',
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `${staffRole.toString()} - Khách hàng cần hỗ trợ cho ticket \`${ticketId}\``
    });
  }
};
