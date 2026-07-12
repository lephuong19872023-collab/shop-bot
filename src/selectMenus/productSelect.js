const EmbedManager = require('../utils/embedBuilder');

module.exports = {
  customId: 'product_select',
  async execute(interaction) {
    const selectedValue = interaction.values[0];

    if (selectedValue !== 'category_decor_gift') {
      return interaction.reply({
        content: 'Lựa chọn không hợp lệ.',
        ephemeral: true
      });
    }

    const decorEmbed = EmbedManager.decorPriceEmbed();

    await interaction.reply({
      embeds: [decorEmbed],
      ephemeral: true
    });
  }
};
