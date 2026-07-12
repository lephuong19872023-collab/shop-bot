const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Database = require('../utils/database');
const config = require('../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addstaffgroup')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Thêm role staff (tối đa 3)')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('Role để thêm')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    // Check if user is admin
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({
        content: 'Bạn không có quyền sử dụng lệnh này!',
        ephemeral: true
      });
    }

    const role = interaction.options.getRole('role');
    
    // Get current staff roles
    let staffRoles = Database.getData('staff-roles');
    if (!staffRoles.roles) {
      staffRoles.roles = [];
    }

    // Check max roles
    if (staffRoles.roles.length >= config.MAX_STAFF_ROLES) {
      return interaction.reply({
        content: `Đã đạt tối đa ${config.MAX_STAFF_ROLES} roles staff!`,
        ephemeral: true
      });
    }

    // Check if role already exists
    if (staffRoles.roles.includes(role.id)) {
      return interaction.reply({
        content: 'Role này đã được thêm!',
        ephemeral: true
      });
    }

    // Add role
    staffRoles.roles.push(role.id);
    Database.saveData('staff-roles', staffRoles);

    const embed = new EmbedBuilder()
      .setColor('#43b581')
      .setTitle('Staff Role Đã Thêm')
      .setDescription(`Role ${role.toString()} đã được thêm vào danh sách staff`)
      .addFields(
        { name: 'Total Roles', value: `${staffRoles.roles.length}/${config.MAX_STAFF_ROLES}`, inline: true },
        { name: 'Roles hiện tại', value: staffRoles.roles.map(id => `<@&${id}>`).join(', '), inline: false }
      )
      .setFooter({ text: 'Lonely So VN • Staff Management' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: false
    });
  }
};
