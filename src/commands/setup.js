const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const EmbedManager = require('../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Thiết lập panel xem giá Decor Gift và nút mở ticket riêng')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('panel')
        .setDescription('Tạo panel xem giá Decor Gift trong channel hiện tại')
    ),
  
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'panel') {
      // Create Select Menu
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('product_select')
        .setPlaceholder('Chọn danh mục để xem giá')
        .addOptions(
          {
            label: 'Decor Gift',
            description: 'Xem giá Decor Gift',
            value: 'category_decor_gift'
          }
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);
      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('btn_open_ticket')
          .setLabel('Mở Ticket')
          .setStyle(ButtonStyle.Primary)
      );

      await interaction.channel.send({
        embeds: [EmbedManager.pricePanelEmbed()],
        components: [row, buttonRow]
      });

      await interaction.reply({
        content: 'Panel giá Decor Gift đã được tạo. Nút Mở Ticket là hành động riêng.',
        ephemeral: true
      });
    }
  }
};
