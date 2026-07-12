#!/usr/bin/env node

/**
 * Cleanup script - Xóa dữ liệu cũ
 * Chạy: node scripts/cleanup.js
 */

const fs = require('fs');
const path = require('path');

const RETENTION_DAYS = 90; // Giữ lại dữ liệu trong 90 ngày

function deleteOldTranscripts() {
  const transcriptsDir = path.join(__dirname, '../transcripts');
  
  if (!fs.existsSync(transcriptsDir)) {
    console.log('❌ Thư mục transcripts không tồn tại');
    return;
  }

  const files = fs.readdirSync(transcriptsDir);
  const now = Date.now();
  let deletedCount = 0;

  files.forEach(file => {
    const filePath = path.join(transcriptsDir, file);
    const stats = fs.statSync(filePath);
    const ageInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

    if (ageInDays > RETENTION_DAYS) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Đã xóa: ${file} (${Math.round(ageInDays)} ngày)`);
      deletedCount++;
    }
  });

  console.log(`✅ Đã xóa ${deletedCount} file transcripts cũ`);
}

function deleteOldLogs() {
  const logsDir = path.join(__dirname, '../logs');
  
  if (!fs.existsSync(logsDir)) {
    console.log('❌ Thư mục logs không tồn tại');
    return;
  }

  const files = fs.readdirSync(logsDir);
  const now = Date.now();
  let deletedCount = 0;

  files.forEach(file => {
    const filePath = path.join(logsDir, file);
    const stats = fs.statSync(filePath);
    const ageInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

    if (ageInDays > 30) { // Giữ lại 30 ngày logs
      fs.unlinkSync(filePath);
      console.log(`🗑️  Đã xóa log: ${file} (${Math.round(ageInDays)} ngày)`);
      deletedCount++;
    }
  });

  console.log(`✅ Đã xóa ${deletedCount} file logs cũ`);
}

function cleanupTicketData() {
  const ticketsPath = path.join(__dirname, '../tickets.json');
  
  if (!fs.existsSync(ticketsPath)) {
    console.log('❌ File tickets.json không tồn tại');
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(ticketsPath, 'utf-8'));
    const now = Date.now();
    let deletedCount = 0;
    let closedCount = 0;

    for (const ticketId in data) {
      const ticket = data[ticketId];
      const ageInDays = (now - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24);

      // Xóa tickets closed cũ hơn 90 ngày
      if (ticket.status === 'closed' && ageInDays > RETENTION_DAYS) {
        delete data[ticketId];
        deletedCount++;
      }

      if (ticket.status === 'closed') {
        closedCount++;
      }
    }

    fs.writeFileSync(ticketsPath, JSON.stringify(data, null, 2));
    console.log(`✅ Đã xóa ${deletedCount} ticket đóng cũ (${closedCount} tickets đã đóng)`);
  } catch (error) {
    console.error('❌ Lỗi khi cleanup tickets:', error);
  }
}

function getStats() {
  console.log('\n📊 Thống Kê Dữ Liệu:\n');

  // Count transcripts
  const transcriptsDir = path.join(__dirname, '../transcripts');
  if (fs.existsSync(transcriptsDir)) {
    const transcripts = fs.readdirSync(transcriptsDir).length;
    console.log(`📄 Transcripts: ${transcripts}`);
  }

  // Count logs
  const logsDir = path.join(__dirname, '../logs');
  if (fs.existsSync(logsDir)) {
    const logs = fs.readdirSync(logsDir).length;
    console.log(`📝 Log files: ${logs}`);
  }

  // Count tickets
  const ticketsPath = path.join(__dirname, '../tickets.json');
  if (fs.existsSync(ticketsPath)) {
    const tickets = JSON.parse(fs.readFileSync(ticketsPath, 'utf-8'));
    const total = Object.keys(tickets).length;
    const open = Object.values(tickets).filter(t => t.status === 'open').length;
    const closed = Object.values(tickets).filter(t => t.status === 'closed').length;
    
    console.log(`🎫 Tickets: ${total} (Mở: ${open}, Đóng: ${closed})`);
  }

  console.log();
}

function main() {
  console.log('\n🧹 Cleanup Bot Data\n');
  console.log('═'.repeat(50));

  getStats();

  console.log('🧹 Đang dọn dẹp...\n');

  deleteOldTranscripts();
  deleteOldLogs();
  cleanupTicketData();

  console.log('\n═'.repeat(50));
  console.log('\n✅ Cleanup hoàn tất!\n');

  getStats();
}

main();
