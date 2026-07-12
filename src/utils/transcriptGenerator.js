const fs = require('fs');
const path = require('path');

class TranscriptGenerator {
  constructor() {
    this.transcriptsDir = path.join(__dirname, '../../transcripts');
    this.ensureDir();
  }

  ensureDir() {
    if (!fs.existsSync(this.transcriptsDir)) {
      fs.mkdirSync(this.transcriptsDir, { recursive: true });
    }
  }

  async generateHTMLTranscript(ticketData, messages) {
    const ticketId = ticketData.id;
    const filename = `ticket-${ticketId}-${Date.now()}.html`;
    const filepath = path.join(this.transcriptsDir, filename);

    const messagesHTML = messages.map(msg => `
      <div class="message">
        <span class="timestamp">[${new Date(msg.timestamp).toLocaleString()}]</span>
        <span class="author">${msg.authorTag}</span>
        <span class="content">${this.escapeHtml(msg.content)}</span>
      </div>
    `).join('');

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Transcript - ${ticketId}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #2f3136;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            color: white;
            text-align: center;
        }
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        .info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
            background: rgba(0, 0, 0, 0.2);
            padding: 15px;
            border-radius: 5px;
        }
        .info-item {
            display: flex;
            flex-direction: column;
        }
        .info-label {
            font-weight: bold;
            opacity: 0.8;
            font-size: 12px;
            text-transform: uppercase;
        }
        .info-value {
            font-size: 14px;
            margin-top: 5px;
        }
        .messages {
            padding: 30px;
            max-height: 600px;
            overflow-y: auto;
        }
        .message {
            margin-bottom: 15px;
            padding: 12px;
            background: #36393f;
            border-left: 4px solid #667eea;
            border-radius: 4px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: flex-start;
        }
        .timestamp {
            color: #72767d;
            font-size: 12px;
            min-width: 150px;
        }
        .author {
            color: #667eea;
            font-weight: bold;
            min-width: 150px;
        }
        .content {
            color: #dcddde;
            flex: 1;
            word-break: break-word;
        }
        .footer {
            background: #36393f;
            padding: 20px 30px;
            text-align: center;
            color: #72767d;
            font-size: 12px;
            border-top: 1px solid #202225;
        }
        .embed {
            background: #36393f;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .embed-title {
            color: #667eea;
            font-weight: bold;
        }
        .embed-field {
            margin: 10px 0;
            color: #dcddde;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ticket Transcript</h1>
            <div class="info">
                <div class="info-item">
                    <span class="info-label">Ticket ID</span>
                    <span class="info-value">${ticketData.id}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Category</span>
                    <span class="info-value">${ticketData.category}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Product</span>
                    <span class="info-value">${ticketData.product}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="info-value">${ticketData.status}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Created At</span>
                    <span class="info-value">${new Date(ticketData.createdAt).toLocaleString('vi-VN')}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Claimed By</span>
                    <span class="info-value">${ticketData.claimedBy ? `<@${ticketData.claimedBy}>` : 'Chưa được hỗ trợ'}</span>
                </div>
            </div>
        </div>
        <div class="messages">
            ${messagesHTML || '<div class="message"><span class="content">Không có tin nhắn nào</span></div>'}
        </div>
        <div class="footer">
            <p>Transcript được tạo vào: ${new Date().toLocaleString('vi-VN')}</p>
            <p>2026 Lonely So VN</p>
        </div>
    </div>
</body>
</html>
    `;

    fs.writeFileSync(filepath, html);
    return filepath;
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

module.exports = new TranscriptGenerator();
