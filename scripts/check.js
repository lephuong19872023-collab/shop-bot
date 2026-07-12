#!/usr/bin/env node

/**
 * Bot Status Checker
 * Chạy: node scripts/check.js
 */

const fs = require('fs');
const path = require('path');

function checkEnvironment() {
  console.log('\n🔍 Kiểm Tra Môi Trường\n');

  // Check Node version
  const nodeVersion = process.version;
  console.log(`✅ Node.js version: ${nodeVersion}`);

  // Check .env file
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    console.log('✅ File .env tồn tại');
  } else {
    console.log('❌ File .env không tồn tại');
    return false;
  }

  // Check package.json
  const packagePath = path.join(__dirname, '../package.json');
  if (fs.existsSync(packagePath)) {
    console.log('✅ File package.json tồn tại');
  } else {
    console.log('❌ File package.json không tồn tại');
    return false;
  }

  // Check node_modules
  const modulesPath = path.join(__dirname, '../node_modules');
  if (fs.existsSync(modulesPath)) {
    console.log('✅ node_modules tồn tại');
  } else {
    console.log('⚠️  node_modules không tồn tại (chạy: npm install)');
  }

  return true;
}

function checkStructure() {
  console.log('\n📁 Kiểm Tra Cấu Trúc Thư Mục\n');

  const dirs = [
    'src',
    'src/commands',
    'src/buttons',
    'src/selectMenus',
    'src/events',
    'src/utils',
    'src/models',
    'src/config'
  ];

  let allOk = true;

  dirs.forEach(dir => {
    const dirPath = path.join(__dirname, '../', dir);
    if (fs.existsSync(dirPath)) {
      console.log(`✅ ${dir}/`);
    } else {
      console.log(`❌ ${dir}/ (missing)`);
      allOk = false;
    }
  });

  return allOk;
}

function checkFiles() {
  console.log('\n📄 Kiểm Tra File Quan Trọng\n');

  const files = [
    'src/index.js',
    'src/config/config.js',
    'src/models/Ticket.js',
    'src/utils/transcriptGenerator.js',
    'src/utils/embedBuilder.js',
    'src/commands/setup.js',
    'src/commands/help.js',
    'package.json',
    '.env.example'
  ];

  let allOk = true;

  files.forEach(file => {
    const filePath = path.join(__dirname, '../', file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} (missing)`);
      allOk = false;
    }
  });

  return allOk;
}

function checkData() {
  console.log('\n💾 Kiểm Tra Dữ Liệu\n');

  // Check tickets
  const ticketsPath = path.join(__dirname, '../tickets.json');
  if (fs.existsSync(ticketsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(ticketsPath, 'utf-8'));
      const count = Object.keys(data).length;
      console.log(`✅ tickets.json (${count} tickets)`);
    } catch (error) {
      console.log('❌ tickets.json (corrupted)');
    }
  } else {
    console.log('⚠️  tickets.json (chưa được tạo)');
  }

  // Check data directory
  const dataDir = path.join(__dirname, '../data');
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir).length;
    console.log(`✅ data/ (${files} files)`);
  } else {
    console.log('⚠️  data/ (chưa được tạo)');
  }

  // Check logs directory
  const logsDir = path.join(__dirname, '../logs');
  if (fs.existsSync(logsDir)) {
    const files = fs.readdirSync(logsDir).length;
    console.log(`✅ logs/ (${files} files)`);
  } else {
    console.log('⚠️  logs/ (chưa được tạo)');
  }

  // Check transcripts directory
  const transcriptsDir = path.join(__dirname, '../transcripts');
  if (fs.existsSync(transcriptsDir)) {
    const files = fs.readdirSync(transcriptsDir).length;
    console.log(`✅ transcripts/ (${files} files)`);
  } else {
    console.log('⚠️  transcripts/ (chưa được tạo)');
  }
}

function checkConfig() {
  console.log('\n⚙️  Kiểm Tra Configuration\n');

  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.log('❌ File .env không tồn tại');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  const required = ['TOKEN', 'CLIENT_ID', 'GUILD_ID', 'SETLOG_CHANNEL', 'STAFF_ROLE'];
  let allOk = true;

  required.forEach(key => {
    if (envContent.includes(`${key}=`) && !envContent.includes(`${key}=your_`)) {
      console.log(`✅ ${key}`);
    } else {
      console.log(`❌ ${key} (missing or not configured)`);
      allOk = false;
    }
  });

  return allOk;
}

function main() {
  console.log('\n═'.repeat(50));
  console.log('🔍 Bot Status Checker\n');

  const envOk = checkEnvironment();
  const structureOk = checkStructure();
  const filesOk = checkFiles();
  checkData();
  const configOk = checkConfig();

  console.log('\n' + '═'.repeat(50));
  console.log('\n📊 Summary:\n');

  if (envOk && structureOk && filesOk && configOk) {
    console.log('✅ Mọi thứ OK! Bạn có thể chạy: npm start\n');
  } else {
    console.log('⚠️  Có vấn đề cần khắc phục!');
    console.log('1. Kiểm tra file .env');
    console.log('2. Chạy: npm install');
    console.log('3. Xem TROUBLESHOOTING.md để biết thêm chi tiết\n');
  }
}

main();
