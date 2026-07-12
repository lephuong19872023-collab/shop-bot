#!/usr/bin/env node

/**
 * Setup Script cho Discord Bot
 * Chạy: node setup.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
};

async function setup() {
  console.log('\n🤖 Setup Discord Bot - Soul Store\n');
  console.log('═'.repeat(50));

  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');

  // Check if .env exists
  if (fs.existsSync(envPath)) {
    const useExisting = await question('\n✅ File .env đã tồn tại. Bạn muốn ghi đè lên nó? (y/n): ');
    if (useExisting.toLowerCase() !== 'y') {
      console.log('\n⚠️ Bỏ qua cấu hình .env');
      rl.close();
      return;
    }
  }

  console.log('\n📝 Vui lòng cung cấp thông tin sau:\n');

  const TOKEN = await question('🔑 Discord Bot Token: ');
  const CLIENT_ID = await question('👤 Client ID: ');
  const GUILD_ID = await question('🏢 Guild ID (Server ID): ');
  const SETLOG_CHANNEL = await question('📝 SetLog Channel ID: ');
  const STAFF_ROLE = await question('👨‍💼 Staff Role ID: ');

  const envContent = `TOKEN=${TOKEN}
CLIENT_ID=${CLIENT_ID}
GUILD_ID=${GUILD_ID}
SETLOG_CHANNEL=${SETLOG_CHANNEL}
STAFF_ROLE=${STAFF_ROLE}
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ File .env đã được tạo thành công!');
  } catch (error) {
    console.error('\n❌ Lỗi khi tạo file .env:', error);
    rl.close();
    return;
  }

  // Check and install dependencies
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      const installDeps = await question('\n📦 Cài đặt dependencies? (y/n): ');
      if (installDeps.toLowerCase() === 'y') {
        console.log('\n⏳ Đang cài đặt dependencies...\n');
        const { execSync } = require('child_process');
        try {
          execSync('npm install', { stdio: 'inherit' });
          console.log('\n✅ Dependencies đã được cài đặt!');
        } catch (error) {
          console.error('\n❌ Lỗi khi cài đặt dependencies:', error);
        }
      }
    }
  }

  console.log('\n' + '═'.repeat(50));
  console.log('\n✨ Setup hoàn tất!\n');
  console.log('📌 Các bước tiếp theo:');
  console.log('   1. Đảm bảo bot có đủ quyền trong server');
  console.log('   2. Chạy: npm start');
  console.log('   3. Trong Discord, gõ: /setup panel\n');

  rl.close();
}

setup().catch(console.error);
