const TicketManager = require('../models/Ticket');
const TranscriptGenerator = require('../utils/transcriptGenerator');
const EmbedManager = require('../utils/embedBuilder');
const Database = require('../utils/database');
const config = require('../config/config');

module.exports = {
  customId: 'btn_close',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const ticketId = interaction.channel.name;
    const ticket = TicketManager.getTicket(ticketId);

    if (!ticket) {
      return interaction.editReply({
        content: 'Ticket không tồn tại.'
      });
    }

    // Check if user is ticket owner or staff
    const staffRolesData = Database.getData('staff-roles') || {};
    const staffRoles = Array.isArray(staffRolesData.roles) ? staffRolesData.roles : [];
    const userRoles = interaction.member.roles.cache.map(r => r.id);
    const isStaff = userRoles.some(roleId => staffRoles.includes(roleId));
    const isTicketOwner = ticket.userId === interaction.user.id;

    if (!isStaff && !isTicketOwner) {
      return interaction.editReply({
        content: 'Chỉ staff hoặc chủ ticket mới có thể đóng ticket.'
      });
    }

    // Generate transcript
    const transcriptPath = await TranscriptGenerator.generateHTMLTranscript(ticket, ticket.messages);
    const filename = transcriptPath.split('\\').pop();

    // Send transcript to configured setlog channel
    const settings = Database.getData('settings');
    const setlogChannelId = settings.setlogChannelId || config.SETLOG_CHANNEL;
    const setlogChannel = interaction.guild.channels.cache.get(setlogChannelId);
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
        content: 'Ticket `' + ticket.displayId + '` đã được đóng. Đây là transcript của bạn.',
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
      content: 'Ticket đã được đóng và transcript đã được gửi.',
      ephemeral: true
    });

    // Delete channel after 5 seconds
    setTimeout(() => {
      interaction.channel.delete().catch(console.error);
    }, 5000);
  }
};
