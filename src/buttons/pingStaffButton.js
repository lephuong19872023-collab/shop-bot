const Database = require('../utils/database');

module.exports = {
  customId: 'btn_ping_staff',
  async execute(interaction) {
    const ticketId = interaction.channel.name;
    const staffRolesData = Database.getData('staff-roles') || {};
    const staffRoles = Array.isArray(staffRolesData.roles) ? staffRolesData.roles : [];

    if (staffRoles.length === 0) {
      return interaction.reply({
        content: 'Không có staff role nào được cấu hình.',
        ephemeral: true
      });
    }

    // Get all staff roles and mention them
    const mentions = staffRoles
      .map(roleId => interaction.guild.roles.cache.get(roleId))
      .filter(role => role)
      .map(role => role.toString())
      .join(' ');

    if (!mentions) {
      return interaction.reply({
        content: 'Không thể tìm thấy role staff.',
        ephemeral: true
      });
    }

    await interaction.reply({
      content: `${mentions} - Khách hàng cần hỗ trợ ngay cho ticket \`${ticketId}\``,
      ephemeral: false
    });
  }
};
