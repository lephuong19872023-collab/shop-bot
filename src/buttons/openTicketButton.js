const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
  customId: 'btn_open_ticket',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('modal_open_ticket')
      .setTitle('Mở Ticket Hỗ Trợ');

    const reasonInput = new TextInputBuilder()
      .setCustomId('ticket_reason')
      .setLabel('Lý do mở ticket')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setPlaceholder('Mô tả nhu cầu hoặc vấn đề cần hỗ trợ');

    const productInput = new TextInputBuilder()
      .setCustomId('ticket_product')
      .setLabel('Sản phẩm muốn mua')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setPlaceholder('Ví dụ: decor 66k / 79k vnđ');

    modal.addComponents(
      new ActionRowBuilder().addComponents(reasonInput),
      new ActionRowBuilder().addComponents(productInput)
    );

    await interaction.showModal(modal);
  }
};
