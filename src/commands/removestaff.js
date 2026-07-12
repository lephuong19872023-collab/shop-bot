const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removestaff')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Xóa role staff')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('Role để xóa')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({
        content: 'Bạn không có quyền sử dụng lệnh này!',
        ephemeral: true
      });
    }

    const role = interaction.options.getRole('role');
    let staffRoles = Database.getData('staff-roles');
    
    if (!staffRoles.roles) {
      return interaction.reply({
        content: 'Không có roles staff nào!',
        ephemeral: true
      });
    }

    const index = staffRoles.roles.indexOf(role.id);
    if (index === -1) {
      return interaction.reply({
        content: 'Role này không có trong danh sách!',
        ephemeral: true
      });
    }

    staffRoles.roles.splice(index, 1);
    Database.saveData('staff-roles', staffRoles);

    const embed = new EmbedBuilder()
      .setColor('#f04747')
      .setTitle('Staff Role đã xóa')
      .setDescription(`Role ${role.toString()} đã bị xóa khỏi danh sách staff`)
      .addFields(
        { name: 'Total Roles', value: `${staffRoles.roles.length}`, inline: true }
      )
      .setFooter({ text: 'Lonely So VN • Staff Management' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: false
    });
  }
};
