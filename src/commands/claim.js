const { SlashCommandBuilder } = require('discord.js');
const TicketManager = require('../models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Nhận ticket để hỗ trợ')
    .addStringOption(option =>
      option
        .setName('ticket_id')
        .setDescription('ID của ticket')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const ticketId = interaction.options.getString('ticket_id');
    const ticket = TicketManager.getTicket(ticketId);

    if (!ticket) {
      return interaction.reply({
        content: 'Ticket không tồn tại.',
        ephemeral: true
      });
    }

    if (ticket.claimedBy) {
      return interaction.reply({
        content: `Ticket này đã được nhận bởi <@${ticket.claimedBy}>.`,
        ephemeral: true
      });
    }

    TicketManager.claimTicket(ticketId, interaction.user.id);

    await interaction.reply({
      content: `Bạn đã nhận ticket \`${ticketId}\``,
      ephemeral: false
    });
  }
};
