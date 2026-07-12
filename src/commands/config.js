const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('../utils/database');
const config = require('../config/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Xem cấu hình hiện tại của bot trong server'),

  async execute(interaction) {
    const settings = Database.getData('settings');
    const staffRoles = Database.getData('staff-roles');
    const setlogChannelId = settings.setlogChannelId || config.SETLOG_CHANNEL || null;
    const ticketCategoryId = settings.ticketCategoryId || null;
    const setlogChannel = setlogChannelId ? (interaction.guild.channels.cache.get(setlogChannelId) || await interaction.guild.channels.fetch(setlogChannelId).catch(() => null)) : null;
    const ticketCategory = ticketCategoryId ? (interaction.guild.channels.cache.get(ticketCategoryId) || await interaction.guild.channels.fetch(ticketCategoryId).catch(() => null)) : null;
    const staffRoleList = Array.isArray(staffRoles.roles) ? staffRoles.roles.map(id => `<@&${id}>`).join(', ') : 'Chưa cấu hình';

    const embed = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Cấu hình hiện tại')
      .addFields(
        { name: 'Channel nhận transcript', value: setlogChannel ? setlogChannel.toString() : (setlogChannelId ? `<#${setlogChannelId}>` : 'Chưa cấu hình'), inline: false },
        { name: 'Category tạo ticket', value: ticketCategory ? ticketCategory.toString() : (ticketCategoryId ? `<#${ticketCategoryId}>` : 'Chưa cấu hình'), inline: false },
        { name: 'Staff roles', value: staffRoleList, inline: false },
        { name: 'Giới hạn ticket user', value: `${config.MAX_TICKETS_PER_USER}`, inline: true },
        { name: 'Giới hạn staff roles', value: `${config.MAX_STAFF_ROLES}`, inline: true }
      )
      .setFooter({ text: 'Lonely So VN • Config' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
