const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const TicketManager = require('../models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Xem thống kê tickets'),
  
  async execute(interaction) {
    const stats = TicketManager.getTicketStats();

    const statsEmbed = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Thống kê tickets')
      .setDescription('Thông tin thống kê về các tickets')
      .addFields(
        { name: 'Tổng tickets', value: `${stats.totalTickets}`, inline: true },
        { name: 'Tickets đang mở', value: `${stats.openTickets}`, inline: true },
        { name: 'Tickets đã đóng', value: `${stats.closedTickets}`, inline: true },
        { name: 'Cập nhật lần cuối', value: `<t:${Math.floor(new Date(stats.lastUpdated).getTime() / 1000)}:F>`, inline: false }
      )
      .setFooter({ text: 'Lonely So VN • Thống kê' })
      .setTimestamp();

    await interaction.reply({
      embeds: [statsEmbed],
      ephemeral: false
    });
  }
};
