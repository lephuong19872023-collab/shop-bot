# 🎫 Shop Discord Bot - Hệ Thống Ticket & Quản Lý

Bot Discord toàn diện với hệ thống ticket, quản lý sản phẩm, và ghi lại transcript tự động.

## 🚀 Tính Năng

✅ **Hệ Thống Ticket**
- Tạo ticket từ select menu
- Các nút Claim, Close, Ping Staff
- Quản lý ticket bằng JSON
- Auto transcript sang HTML

✅ **Quản Lý Sản Phẩm**
- Các sản phẩm Decor Gift
- Phân loại danh mục sản phẩm
- Lựa chọn sản phẩm qua select menu

✅ **Ghi Lại Transcript**
- Xuất ticket thành file HTML
- Gửi tự động về channel setlog
- Thông tin đầy đủ (người dùng, staff, thời gian, pesan)

✅ **Lệnh Slash**
- `/setup panel` - Tạo panel ticket
- `/claim <ticket_id>` - Nhận ticket
- `/close <ticket_id> [reason]` - Đóng ticket
- `/ping <ticket_id>` - Gọi staff

## 📦 Cấu Trúc Thư Mục

```
shop discord bot/
├── src/
│   ├── commands/           # Slash commands
│   │   ├── setup.js       # Thiết lập panel
│   │   ├── claim.js       # Nhận ticket
│   │   ├── close.js       # Đóng ticket
│   │   └── ping.js        # Gọi staff
│   ├── buttons/           # Button handlers
│   │   ├── claimButton.js
│   │   ├── closeButton.js
│   │   └── pingStaffButton.js
│   ├── selectMenus/       # Select menu handlers
│   │   └── productSelect.js
│   ├── events/            # Event listeners
│   │   ├── ready.js
│   │   ├── interactionCreate.js
│   │   └── messageCreate.js
│   ├── utils/             # Tiện ích
│   │   ├── transcriptGenerator.js
│   │   └── embedBuilder.js
│   ├── models/            # Data models
│   │   └── Ticket.js
│   ├── config/            # Configuration
│   │   └── config.js
│   └── index.js           # Main file
├── package.json
├── .env.example
└── README.md
```

## 🔧 Cài Đặt

### 1. Clone/Download Repository
```bash
cd "c:\Users\giahu\Downloads\zz1\shop discord bot"
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Cấu Hình .env
Sao chép `.env.example` thành `.env` và điền thông tin:

```env
TOKEN=your_discord_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
SETLOG_CHANNEL=setlog_channel_id
STAFF_ROLE=staff_role_id
```

### 4. Chạy Bot
```bash
npm start
```

Hoặc dùng nodemon để phát triển:
```bash
npm run dev
```

## 📝 Cách Sử Dụng

### 1. Thiết Lập Panel Ticket
```
/setup panel
```
Sẽ tạo một panel với select menu để chọn sản phẩm

### 2. Khách Hàng Tạo Ticket
- Chọn sản phẩm từ select menu
- Bot sẽ tạo channel private cho ticket
- Channel sẽ có 3 nút: Claim, Close, Ping Staff

### 3. Staff Nhận Ticket
- Click nút "Nhận Ticket" (Claim)
- Hoặc dùng lệnh `/claim <ticket_id>`

### 4. Đóng Ticket
- Click nút "Đóng Ticket" (Close)
- Hoặc dùng lệnh `/close <ticket_id> [reason]`
- Transcript sẽ tự động gửi về setlog channel

### 5. Gọi Staff
- Khách hàng click nút "Gọi Staff"
- Hoặc dùng `/ping <ticket_id>`

## 💾 Dữ Liệu

### Ticket JSON (tickets.json)
```json
{
  "ticket-123456789": {
    "id": "ticket-123456789",
    "userId": "987654321",
    "category": "Decor Gift",
    "product": "Decor 79k / 105k VNĐ",
    "createdAt": "2024-07-12T10:30:00.000Z",
    "status": "open",
    "claimedBy": null,
    "messages": [
      {
        "userId": "987654321",
        "content": "Tôi muốn mua sản phẩm này",
        "timestamp": "2024-07-12T10:30:30.000Z"
      }
    ]
  }
}
```

### Transcript HTML
Tệp transcript được lưu trong thư mục `transcripts/` với định dạng:
```
ticket-{ticketId}-{timestamp}.html
```

## 🔐 Quyền Discord

Bot cần các quyền sau:
- `Send Messages`
- `Read Messages/View Channels`
- `Embed Links`
- `Attach Files`
- `Manage Channels` (để tạo ticket channels)
- `Read Message History`
- `Mention @everyone, @here, and All Roles`

## 🤝 Hỗ Trợ

Nếu có vấn đề, hãy:
1. Kiểm tra `.env` có đúng không
2. Xem console log để tìm lỗi
3. Đảm bảo bot có đủ quyền trong server

## 📄 License

MIT License - Sử dụng tự do cho mục đích cá nhân hoặc thương mại

---

**Soul Store Bot v1.0** • Dev By Mtien
