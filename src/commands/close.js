const { SlashCommandBuilder } = require('discord.js');
const TicketManager = require('../models/Ticket');
const Database = require('../utils/database');
const TranscriptGenerator = require('../utils/transcriptGenerator');
const EmbedManager = require('../utils/embedBuilder');
const config = require('../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Đóng ticket')
    .addStringOption(option =>
      option
        .setName('ticket_id')
        .setDescription('ID của ticket')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('reason')
        .setDescription('Lý do đóng ticket')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const ticketId = interaction.options.getString('ticket_id');
    const reason = interaction.options.getString('reason') || 'Không có lý do';
    const ticket = TicketManager.getTicket(ticketId);

    if (!ticket) {
      return interaction.editReply({
        content: 'Ticket không tồn tại.'
      });
    }

    // Generate transcript
    const transcriptPath = await TranscriptGenerator.generateHTMLTranscript(ticket, ticket.messages);
    const filename = transcriptPath.split('\\').pop();

    // Send transcript to configured setlog channel
    const settings = Database.getData('settings');
    const setlogChannelId = settings.setlogChannelId || config.SETLOG_CHANNEL;
    let setlogChannel = null;
    if (setlogChannelId) {
      setlogChannel = interaction.guild.channels.cache.get(setlogChannelId) || await interaction.guild.channels.fetch(setlogChannelId).catch(() => null);
    }
    if (setlogChannel) {
      await setlogChannel.send({
        embeds: [EmbedManager.transcriptEmbed(ticket.displayId, filename)],
        files: [transcriptPath]
      });
    }

    // Send transcript DM to ticket owner
    try {
      const user = await interaction.client.users.fetch(ticket.userId);
      await user.send({
        content: `Ticket \`${ticket.displayId}\` đã được đóng. Đây là transcript của bạn.`,
        embeds: [EmbedManager.transcriptEmbed(ticket.displayId, filename)],
        files: [transcriptPath]
      });
    } catch (error) {
      console.error('Không thể gửi DM transcript cho người dùng:', error);
    }

    // Update ticket status
    TicketManager.updateTicket(ticketId, { status: 'closed' });

    await interaction.editReply({
      embeds: [EmbedManager.ticketClosedEmbed(ticket.displayId)],
      content: `Lý do: ${reason}`
    });
  }
};
