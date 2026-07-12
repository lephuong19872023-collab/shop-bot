const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const TicketManager = require('../models/Ticket');
const Database = require('../utils/database');
const EmbedManager = require('../utils/embedBuilder');
const config = require('../config/config');

module.exports = {
  customId: 'modal_open_ticket',
  async execute(interaction) {
    const guild = interaction.guild;
    const settings = Database.getData('settings');
    const categoryChannel = settings.ticketCategoryId ? guild.channels.cache.get(settings.ticketCategoryId) : null;
    const categoryName = categoryChannel ? categoryChannel.name : 'Hỗ trợ';

    // Đồng bộ ticket đang mở với channel thực tế trước khi tạo mới
    TicketManager.syncOpenTickets(guild);
    TicketManager.migrateLegacyTickets(guild);

    const existingTickets = TicketManager.getUserOpenTickets(interaction.user.id, guild);
    if (existingTickets.length >= config.MAX_TICKETS_PER_USER) {
      return interaction.reply({
        content: 'Bạn chỉ có một ticket đang mở cùng lúc.',
        ephemeral: true
      });
    }

    const reason = interaction.fields.getTextInputValue('ticket_reason');
    const product = interaction.fields.getTextInputValue('ticket_product');

    const ticket = TicketManager.createTicket(
      interaction.user.id,
      categoryName,
      product,
      guild,
      interaction.user.username,
      reason
    );
    if (!ticket) {
      return interaction.reply({
        content: 'Bạn đã có ticket mở. Vui lòng đóng ticket trước khi tạo ticket mới.',
        ephemeral: true
      });
    }

    const staffRolesData = Database.getData('staff-roles') || {};
    const staffRoleIds = Array.isArray(staffRolesData.roles) ? staffRolesData.roles : [];
    const permissionOverwrites = [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
      },
      {
        id: interaction.client.user.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
      }
    ];

    for (const roleId of staffRoleIds) {
      permissionOverwrites.push({
        id: roleId,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
      });
    }

    const ticketChannelOptions = {
      name: ticket.channelName,
      type: ChannelType.GuildText,
      permissionOverwrites,
      reason: 'Tạo ticket từ panel mở ticket'
    };

    if (categoryChannel) {
      ticketChannelOptions.parent = categoryChannel.id;
    }

    const ticketChannel = await guild.channels.create(ticketChannelOptions);

    const ticketActions = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('btn_claim')
        .setLabel('Nhận Ticket')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('btn_close')
        .setLabel('Đóng Ticket')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('btn_ping_staff')
        .setLabel('Gọi Staff')
        .setStyle(ButtonStyle.Secondary)
    );

    await ticketChannel.send({
      content: `<@${interaction.user.id}> đã tạo ticket. Staff sẽ hỗ trợ sớm.`,
      embeds: [EmbedManager.ticketCreatedEmbed(ticket)],
      components: [ticketActions]
    });

    await interaction.reply({
      content: `Ticket đã được tạo: ${ticketChannel.toString()}`,
      ephemeral: true
    });
  }
};
