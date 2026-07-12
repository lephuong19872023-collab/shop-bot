const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.ensureDir();
  }

  ensureDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  getData(filename) {
    const filepath = path.join(this.dataDir, `${filename}.json`);
    
    if (!fs.existsSync(filepath)) {
      return {};
    }

    try {
      const data = fs.readFileSync(filepath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return {};
    }
  }

  saveData(filename, data) {
    const filepath = path.join(this.dataDir, `${filename}.json`);
    
    try {
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error saving ${filename}:`, error);
      return false;
    }
  }

  getTicketHistory(userId) {
    const tickets = this.getData('ticket-history');
    return tickets[userId] || [];
  }

  saveTicketHistory(userId, ticketInfo) {
    const tickets = this.getData('ticket-history');
    
    if (!tickets[userId]) {
      tickets[userId] = [];
    }

    tickets[userId].push({
      ...ticketInfo,
      timestamp: new Date().toISOString()
    });

    this.saveData('ticket-history', tickets);
  }

  getTicketStats() {
    const stats = this.getData('stats');
    return {
      totalTickets: stats.totalTickets || 0,
      openTickets: stats.openTickets || 0,
      closedTickets: stats.closedTickets || 0,
      lastUpdated: stats.lastUpdated || new Date().toISOString()
    };
  }

  updateStats(newStats) {
    const stats = this.getData('stats');
    const updated = {
      ...stats,
      ...newStats,
      lastUpdated: new Date().toISOString()
    };
    this.saveData('stats', updated);
  }
}

module.exports = new Database();
