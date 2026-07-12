const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'Có lỗi khi thực thi lệnh.',
          ephemeral: true
        }).catch(console.error);
      }
    }

    // Handle buttons
    if (interaction.isButton()) {
      try {
        const buttonId = interaction.customId.replace(/^btn_/, '');
        const fileName = buttonId
          .split('_')
          .map((part, index) => index === 0 ? part : part[0].toUpperCase() + part.slice(1))
          .join('') + 'Button.js';
        const buttonFilePath = `../buttons/${fileName}`;

        const buttonFile = require(buttonFilePath);
        if (!buttonFile) return;

        await buttonFile.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `Có lỗi khi xử lý nút: ${error.message}`,
          ephemeral: true
        }).catch(console.error);
      }
    }

    // Handle select menus
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'product_select') {
        const selectMenu = require('../selectMenus/productSelect.js');
        try {
          await selectMenu.execute(interaction);
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: 'Có lỗi khi xử lý menu.',
            ephemeral: true
          }).catch(console.error);
        }
      }
    }

    // Handle modals
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'modal_open_ticket') {
        const modalHandler = require('../modals/openTicketModal.js');
        try {
          await modalHandler.execute(interaction);
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: 'Có lỗi khi xử lý form mở ticket.',
            ephemeral: true
          }).catch(console.error);
        }
      }
    }
  }
};
