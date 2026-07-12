const EmbedManager = require('../utils/embedBuilder');
const TicketManager = require('../models/Ticket');
const Database = require('../utils/database');

module.exports = {
  customId: 'btn_claim',
  async execute(interaction) {
    const ticketId = interaction.channel.name;
    
    // Check if user is staff
    const staffRolesData = Database.getData('staff-roles') || {};
    const staffRoles = Array.isArray(staffRolesData.roles) ? staffRolesData.roles : [];
    const userRoles = interaction.member.roles.cache.map(r => r.id);
    const isStaff = userRoles.some(roleId => staffRoles.includes(roleId));

    if (!isStaff) {
      return interaction.reply({
        content: 'Bạn không có quyền nhận ticket này.',
        ephemeral: true
      });
    }

    const ticket = TicketManager.getTicket(ticketId);

    if (!ticket) {
      return interaction.reply({
        content: 'Ticket không tồn tại.',
        ephemeral: true
      });
    }

    if (ticket.claimedBy) {
      return interaction.reply({
        content: `Ticket này đã được nhận bởi <@${ticket.claimedBy}>`,
        ephemeral: true
      });
    }

    TicketManager.claimTicket(ticketId, interaction.user.id);

    await interaction.reply({
      embeds: [EmbedManager.staffClaimedEmbed(interaction.user.tag)],
      ephemeral: false
    });
  }
};
