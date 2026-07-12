const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Hiển thị danh sách các lệnh có sẵn'),
  
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Danh sách lệnh - Lonely So VN')
      .setDescription('Các lệnh có sẵn')
      .addFields(
        {
          name: 'Lệnh Ticket',
          value: `
\`/setup panel\` - Tạo panel xem giá Decor Gift với nút Mở Ticket riêng
\`/ticketset panel\` - Tạo panel mở ticket riêng trong channel hiện tại
\`/ticketcategory <category>\` - Cài đặt category để nút Mở Ticket tạo ticket vào đó
\`/claim <ticket_id>\` - Nhận một ticket để hỗ trợ
\`/close <ticket_id> [reason]\` - Đóng ticket và tạo transcript
\`/ping <ticket_id>\` - Gọi staff hỗ trợ ngay lập tức
          `,
          inline: false
        },
        {
          name: 'Lệnh thông tin',
          value: `
\`/help\` - Hiển thị danh sách lệnh này
\`/stats\` - Xem thống kê tickets
\`/ticket-info <ticket_id>\` - Xem thông tin ticket
\`/config\` - Xem cấu hình bot hiện tại
          `,
          inline: false
        },
        {
          name: 'Cách sử dụng',
          value: `
1. Staff dùng \`/setup panel\` để tạo panel giá Decor Gift
2. Khách hàng chọn \`Decor Gift\` để xem giá riêng (nút Mở Ticket là riêng)
3. Staff dùng \`/ticketset panel\` để tạo panel mở ticket riêng
4. Người dùng bấm \`Mở Ticket\` để mở ticket chung
5. Dùng \`/ticketcategory\` chọn category server để tạo ticket trong category đó
6. Staff nhận ticket bằng \`Nhận Ticket\` và đóng khi xong
7. Transcript gửi về channel đã cấu hình bằng \`/setlog\`
          `,
          inline: false
        }
      )
      .setFooter({ text: 'Lonely So VN • Lệnh được cập nhật lần cuối: 12/07/2024' })
      .setTimestamp();

    await interaction.reply({
      embeds: [helpEmbed],
      ephemeral: false
    });
  }
};
