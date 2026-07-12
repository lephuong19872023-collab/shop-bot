const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const TicketManager = require('../models/Ticket');

const getStatusText = (status) => {
  const statusText = {
    'open': 'Mở',
    'closed': 'Đã đóng',
    'claimed': 'Đang xử lý'
  };
  return statusText[status] || 'Không xác định';
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-info')
    .setDescription('Xem thông tin chi tiết của một ticket')
    .addStringOption(option =>
      option
        .setName('ticket_id')
        .setDescription('ID của ticket')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const ticketId = interaction.options.getString('ticket_id');
    const ticket = TicketManager.getTicket(ticketId);

    if (!ticket) {
      return interaction.reply({
        content: 'Ticket không tồn tại.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle(`Thông tin ticket - ${ticket.displayId || ticketId}`)
      .addFields(
        { name: 'ID', value: `\`${ticket.displayId || ticket.id}\``, inline: true },
        { name: 'Người tạo', value: `<@${ticket.userId}>`, inline: true },
        { name: 'Sản phẩm', value: ticket.product, inline: true },
        { name: 'Trạng thái', value: getStatusText(ticket.status), inline: true },
        { name: 'Được nhận bởi', value: ticket.claimedBy ? `<@${ticket.claimedBy}>` : 'Chưa được hỗ trợ', inline: true },
        { name: 'Thời gian tạo', value: `<t:${Math.floor(new Date(ticket.createdAt).getTime() / 1000)}:F>`, inline: false },
        { name: 'Số tin nhắn', value: `${ticket.messages.length}`, inline: true }
      )
      .setFooter({ text: 'Lonely So VN • Thông tin ticket' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: false
    });
  }
};
