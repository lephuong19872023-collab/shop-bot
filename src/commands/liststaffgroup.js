const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');
const config = require('../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('liststaffgroup')
    .setDescription('Xem danh sách staff roles'),
  
  async execute(interaction) {
    let staffRoles = Database.getData('staff-roles');
    
    if (!staffRoles.roles || staffRoles.roles.length === 0) {
      return interaction.reply({
        content: 'Không có roles staff nào!',
        ephemeral: true
      });
    }

    const rolesList = staffRoles.roles.map((id, index) => {
      return `${index + 1}. <@&${id}>`;
    }).join('\n');

    const embed = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Danh sách staff roles')
      .setDescription(rolesList)
      .addFields(
        { name: 'Total', value: `${staffRoles.roles.length}/${config.MAX_STAFF_ROLES}`, inline: true }
      )
      .setFooter({ text: 'Lonely So VN • Staff Management' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: false
    });
  }
};
