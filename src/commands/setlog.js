const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlog')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Cài đặt channel nhận transcript ticket')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Chọn channel để gửi transcript ticket')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({
        content: 'Bạn không có quyền sử dụng lệnh này!',
        ephemeral: true
      });
    }

    const channel = interaction.options.getChannel('channel');
    const settings = Database.getData('settings');
    settings.setlogChannelId = channel.id;
    Database.saveData('settings', settings);

    const embed = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Channel log đã được cập nhật')
      .setDescription(`Transcript ticket sẽ được gửi đến ${channel.toString()}`)
      .setFooter({ text: 'Lonely So VN • Setlog' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
