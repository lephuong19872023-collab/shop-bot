const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const TicketManager = require('../models/Ticket');
const Database = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('syncticket')
    .setDescription('Xóa các ticket không còn channel trong database')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guild = interaction.guild;
    const deletedCount = TicketManager.cleanMissingTickets(guild);

    await interaction.reply({
      content: `Đã xóa ${deletedCount} ticket không tồn tại khỏi database.`,
      ephemeral: true
    });
  }
};
