const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const EmbedManager = require('../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketset')
    .setDescription('Thiết lập panel mở ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('panel')
        .setDescription('Tạo panel mở ticket trong channel hiện tại')
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'panel') {
      const openTicketButton = new ButtonBuilder()
        .setCustomId('btn_open_ticket')
        .setLabel('Mở Ticket')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(openTicketButton);

      await interaction.channel.send({
        embeds: [EmbedManager.ticketPanelEmbed()],
        components: [row]
      });

      await interaction.reply({
        content: 'Panel mở ticket đã được tạo thành công.',
        ephemeral: true
      });
    }
  }
};
