#!/usr/bin/env node

/**
 * Database Backup Script
 * Chạy: node scripts/backup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function backup() {
  const backupDir = path.join(__dirname, '../backups');
  
  // Tạo thư mục backups nếu chưa có
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `backup-${timestamp}`;
  const backupPath = path.join(backupDir, backupName);

  console.log(`\n💾 Đang backup dữ liệu...\n`);

  // Copy files
  const filesToBackup = [
    'tickets.json',
    'data/ticket-history.json',
    'data/stats.json'
  ];

  fs.mkdirSync(backupPath, { recursive: true });

  filesToBackup.forEach(file => {
    const sourcePath = path.join(__dirname, '../', file);
    const destPath = path.join(backupPath, file);

    if (fs.existsSync(sourcePath)) {
      // Create subdirs if needed
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Backup: ${file}`);
    }
  });

  // Copy logs
  const logsDir = path.join(__dirname, '../logs');
  if (fs.existsSync(logsDir)) {
    const logsBackupPath = path.join(backupPath, 'logs');
    fs.mkdirSync(logsBackupPath, { recursive: true });
    
    const logFiles = fs.readdirSync(logsDir);
    logFiles.forEach(file => {
      fs.copyFileSync(
        path.join(logsDir, file),
        path.join(logsBackupPath, file)
      );
    });
    console.log(`✅ Backup: logs/ (${logFiles.length} files)`);
  }

  console.log(`\n✅ Backup hoàn tất: ${backupPath}\n`);
  
  // Show backup size
  const sizeKb = getDirectorySize(backupPath) / 1024;
  console.log(`📦 Kích thước: ${sizeKb.toFixed(2)} KB\n`);
}

function getDirectorySize(dir) {
  let size = 0;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  });

  return size;
}

function listBackups() {
  const backupDir = path.join(__dirname, '../backups');
  
  if (!fs.existsSync(backupDir)) {
    console.log('❌ Chưa có backup nào\n');
    return;
  }

  const backups = fs.readdirSync(backupDir);
  
  if (backups.length === 0) {
    console.log('❌ Chưa có backup nào\n');
    return;
  }

  console.log('\n📋 Danh Sách Backups:\n');
  backups.forEach((backup, index) => {
    const backupPath = path.join(backupDir, backup);
    const size = getDirectorySize(backupPath);
    const sizeMb = (size / (1024 * 1024)).toFixed(2);
    const stats = fs.statSync(backupPath);
    const date = stats.mtime.toLocaleString('vi-VN');
    
    console.log(`${index + 1}. ${backup}`);
    console.log(`   📅 Thời gian: ${date}`);
    console.log(`   📦 Kích thước: ${sizeMb} MB\n`);
  });
}

function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--list' || args[0] === '-l') {
    console.log('\n💾 Database Backup\n');
    console.log('═'.repeat(50));
    listBackups();
  } else {
    console.log('\n💾 Database Backup\n');
    console.log('═'.repeat(50));
    backup();
    listBackups();
  }
}

main();
