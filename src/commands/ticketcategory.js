const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const Database = require('../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketcategory')
    .setDescription('Cài đặt category để nút Mở Ticket tạo ticket vào đó')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option
        .setName('category')
        .setDescription('Chọn category để lưu ticket tạo ra')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    ),

  async execute(interaction) {
    const categoryChannel = interaction.options.getChannel('category');
    if (!categoryChannel || categoryChannel.type !== ChannelType.GuildCategory) {
      return interaction.reply({
        content: 'Vui lòng chọn một category hợp lệ.',
        ephemeral: true
      });
    }

    const settings = Database.getData('settings');
    settings.ticketCategoryId = categoryChannel.id;
    Database.saveData('settings', settings);

    await interaction.reply({
      content: `Đã lưu category ${categoryChannel.name} cho nút Mở Ticket. Ticket mới sẽ được tạo trong category này.`,
      ephemeral: true
    });
  }
};
