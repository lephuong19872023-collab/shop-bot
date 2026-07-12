const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

class EmbedManager {
  static pricePanelEmbed() {
    return new EmbedBuilder()
      .setColor('#00b894')
      .setTitle('BẢNG GIÁ - MUA HÀNG')
      .setDescription('Đọc chính sách trước khi mua.\nSau khi hoàn thành đơn, vui lòng nhớ +1 LEGIT.\n\nChọn sản phẩm bên dưới để xem bảng giá.\nNút "Mở Ticket" là hành động riêng và dùng để mở ticket hỗ trợ.')
      .setFooter({ text: 'Lonely So VN' })
      .setTimestamp();
  }

  static ticketPanelEmbed() {
    return new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Mở Ticket Hỗ Trợ')
      .setDescription('Nhấn nút bên dưới để mở ticket hỗ trợ. Mỗi người chỉ được mở tối đa một ticket đang hoạt động.')
      .addFields(
        { name: 'Hướng dẫn', value: 'Điền lý do và sản phẩm trong form để staff hỗ trợ nhanh. Khi hoàn tất, đóng ticket để gửi transcript cho bạn và về channel setlog.', inline: false }
      )
      .setFooter({ text: 'Lonely So VN' })
      .setTimestamp();
  }

  static ticketCreatedEmbed(ticket) {
    return new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Ticket Đã Tạo')
      .setDescription('Ticket đã được tạo. Staff sẽ hỗ trợ bạn sớm.')
      .addFields(
        { name: 'Mã Ticket', value: `
${ticket.id}`, inline: true },
        { name: 'Tên Ticket', value: `
${ticket.displayId}`, inline: false },
        { name: 'Sản Phẩm', value: `${ticket.product}`, inline: true },
        { name: 'Lý do', value: `${ticket.reason || 'Không có'}`, inline: true },
        { name: 'Trạng Thái', value: 'Chờ hỗ trợ', inline: true }
      )
      .setFooter({ text: 'Lonely So VN • 2026' })
      .setTimestamp();
  }

  static decorPriceEmbed() {
    const fields = config.PRODUCTS.map(p => ({
      name: `${p.name}`,
      value: `\`${p.shopPrice}\``,
      inline: false
    }));

    return new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Giá Decor Gift')
      .setDescription('Dưới đây là giá mua shop cho các sản phẩm Decor Gift.')
      .addFields(fields)
      .setFooter({ text: 'Lonely So VN' })
      .setTimestamp();
  }

  static ticketClosedEmbed(ticketId) {
    return new EmbedBuilder()
      .setColor('#f04747')
      .setTitle('Ticket Đã Đóng')
      .setDescription(`Ticket \`${ticketId}\` đã được đóng`)
      .addFields(
        { name: 'Trạng Thái', value: 'Đã Đóng', inline: true },
        { name: 'Hành Động', value: 'Ticket này không còn tiếp nhận tin nhắn mới.', inline: false }
      )
      .setFooter({ text: 'Lonely So VN • 2026' })
      .setTimestamp();
  }

  static staffClaimedEmbed(staffName) {
    return new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Ticket Được Nhận')
      .setDescription(`${staffName} đã tiếp nhận ticket này.`)
      .setFooter({ text: 'Lonely So VN • Sẵn sàng hỗ trợ' })
      .setTimestamp();
  }

  static transcriptEmbed(ticketId, filename) {
    return new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Transcript Ticket')
      .setDescription(`Transcript cho ticket \`${ticketId}\``)
      .addFields(
        { name: 'File', value: `\`${filename}\``, inline: false },
        { name: 'Thời Gian', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
      )
      .setFooter({ text: 'Lonely So VN • Lưu trữ transcript' })
      .setTimestamp();
  }
}

module.exports = EmbedManager;
