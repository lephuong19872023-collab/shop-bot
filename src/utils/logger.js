const fs = require('fs');
const path = require('path');

class Logger {
  static log(message) {
    const timestamp = new Date().toLocaleString('vi-VN');
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    this.writeToFile(logMessage);
  }

  static error(message) {
    const timestamp = new Date().toLocaleString('vi-VN');
    const logMessage = `[${timestamp}] [ERROR] ${message}`;
    console.error(logMessage);
    this.writeToFile(logMessage);
  }

  static success(message) {
    const timestamp = new Date().toLocaleString('vi-VN');
    const logMessage = `[${timestamp}] [SUCCESS] ${message}`;
    console.log('\x1b[32m%s\x1b[0m', logMessage);
    this.writeToFile(logMessage);
  }

  static warning(message) {
    const timestamp = new Date().toLocaleString('vi-VN');
    const logMessage = `[${timestamp}] [WARNING] ${message}`;
    console.warn('\x1b[33m%s\x1b[0m', logMessage);
    this.writeToFile(logMessage);
  }

  static writeToFile(message) {
    const logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `${today}.log`);

    fs.appendFileSync(logFile, message + '\n');
  }
}

module.exports = Logger;
