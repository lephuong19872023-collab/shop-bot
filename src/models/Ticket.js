const fs = require('fs');
const path = require('path');
const config = require('../config/config');

class TicketManager {
  constructor() {
    this.ticketsPath = path.join(__dirname, '../../tickets.json');
    this.ensureFile();
    this.migrateLegacyTickets();
  }

  ensureFile() {
    if (!fs.existsSync(this.ticketsPath)) {
      fs.writeFileSync(this.ticketsPath, JSON.stringify({}, null, 2));
    }
  }

  getTickets() {
    const data = fs.readFileSync(this.ticketsPath, 'utf-8');
    return JSON.parse(data);
  }

  saveTickets(tickets) {
    fs.writeFileSync(this.ticketsPath, JSON.stringify(tickets, null, 2));
  }

  getNextTicketNumber(tickets) {
    const numericIds = Object.values(tickets)
      .map(ticket => {
        if (ticket && typeof ticket.displayId === 'string') {
          const match = ticket.displayId.match(/^🎫\|[^|]+\|(\d{3})$/);
          if (match) {
            const value = parseInt(match[1], 10);
            return Number.isNaN(value) ? null : value;
          }
        }

        if (ticket && typeof ticket.id === 'string' && /^\d{1,3}$/.test(ticket.id)) {
          return parseInt(ticket.id, 10);
        }

        return null;
      })
      .filter(Number.isFinite);

    if (numericIds.length > 0) {
      return Math.max(...numericIds) + 1;
    }

    return 1;
  }

  extractUsername(displayId) {
    if (typeof displayId !== 'string') return 'User';
    const parts = displayId.split('|');
    if (parts.length >= 3 && parts[1]) {
      return parts[1].replace(/\|/g, '').replace(/\s+/g, '') || 'User';
    }
    return 'User';
  }

  migrateLegacyTickets(guild = null) {
    const tickets = this.getTickets();
    const normalized = {};
    const assignedIds = new Set();
    let changed = false;

    const normalizeKey = key => (typeof key === 'string' && /^\d{3}$/.test(key) ? key : null);

    const formatDisplayId = (username, ticketId) => `🎫|${username.replace(/\|/g, '').replace(/\s+/g, '')}|${ticketId}`;

    const getNextAvailableId = () => {
      let nextId = 1;
      while (assignedIds.has(String(nextId).padStart(3, '0'))) {
        nextId += 1;
      }
      return String(nextId).padStart(3, '0');
    };

    const legacyTickets = [];

    for (const [key, ticket] of Object.entries(tickets)) {
      const validKey = normalizeKey(ticket.id) || normalizeKey(key);
      if (validKey && !assignedIds.has(validKey)) {
        assignedIds.add(validKey);
        const username = this.extractUsername(ticket.displayId || ticket.channelName || 'User');
        const displayId = typeof ticket.displayId === 'string' && ticket.displayId.match(/\|\d{3}$/)
          ? ticket.displayId
          : formatDisplayId(username, validKey);
        const channelName = ticket.channelName || `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}-${validKey}`;
        normalized[validKey] = { ...ticket, id: validKey, displayId, channelName };
        if (key !== validKey) changed = true;
      } else {
        legacyTickets.push({ key, ticket });
      }
    }

    for (const { key, ticket } of legacyTickets) {
      const newId = getNextAvailableId();
      const username = this.extractUsername(ticket.displayId || ticket.channelName || 'User');
      const newDisplayId = formatDisplayId(username, newId);
      const newChannelName = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}-${newId}`;
      const oldChannelName = ticket.channelName || ticket.displayId;
      normalized[newId] = { ...ticket, id: newId, displayId: newDisplayId, channelName: newChannelName };
      assignedIds.add(newId);
      changed = true;

      if (guild && typeof oldChannelName === 'string') {
        const channel = guild.channels.cache.find(c => c.name === oldChannelName);
        if (channel) {
          channel.setName(newChannelName, 'Migrating legacy ticket channel name to new ticket channel format').catch(() => null);
        }
      }
    }

    if (changed) {
      this.saveTickets(normalized);
    }

    return normalized;
  }

  resolveTicketKey(ticketId) {
    const tickets = this.getTickets();
    if (tickets[ticketId]) {
      return ticketId;
    }

    const found = Object.entries(tickets).find(([, ticket]) =>
      ticket.displayId === ticketId ||
      ticket.channelName === ticketId ||
      ticket.id === ticketId
    );
    return found ? found[0] : null;
  }

  createTicket(userId, category, product, guild = null, username = 'USER', reason = '') {
    const tickets = this.getTickets();

    let userTickets = Object.values(tickets).filter(t =>
      t.userId === userId && t.status === 'open'
    );

    if (guild) {
      userTickets = userTickets.filter(ticket => {
        const channelName = ticket.displayId;
        return guild.channels.cache.some(channel => channel.name === channelName);
      });
    }

    if (userTickets.length >= config.MAX_TICKETS_PER_USER) {
      return null;
    }

    const ticketNumber = this.getNextTicketNumber(tickets);
    const ticketId = String(ticketNumber).padStart(3, '0');
    const cleanName = username
      .replace(/\|/g, '')
      .replace(/\s+/g, '')
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase() || 'user';
    const channelName = `${cleanName}-${ticketId}`;
    const displayId = `🎫|${cleanName}|${ticketId}`;

    tickets[ticketId] = {
      id: ticketId,
      displayId,
      channelName,
      userId: userId,
      category: category,
      product: product,
      reason: reason,
      createdAt: new Date().toISOString(),
      status: 'open',
      claimedBy: null,
      messages: []
    };
    this.saveTickets(tickets);
    return tickets[ticketId];
  }

  getTicket(ticketId) {
    const tickets = this.getTickets();
    const resolvedKey = this.resolveTicketKey(ticketId);
    return resolvedKey ? tickets[resolvedKey] : null;
  }

  getTicketStats() {
    const tickets = Object.values(this.getTickets());
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
    const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
    return {
      totalTickets,
      openTickets,
      closedTickets,
      lastUpdated: new Date().toISOString()
    };
  }

  updateTicket(ticketId, data) {
    const tickets = this.getTickets();
    const resolvedKey = this.resolveTicketKey(ticketId);
    if (resolvedKey && tickets[resolvedKey]) {
      tickets[resolvedKey] = { ...tickets[resolvedKey], ...data };
      this.saveTickets(tickets);
      return tickets[resolvedKey];
    }
    return null;
  }

  deleteTicket(ticketId) {
    const tickets = this.getTickets();
    const resolvedKey = this.resolveTicketKey(ticketId);
    if (resolvedKey) {
      delete tickets[resolvedKey];
      this.saveTickets(tickets);
    }
  }

  claimTicket(ticketId, staffId) {
    return this.updateTicket(ticketId, { claimedBy: staffId });
  }

  addMessage(ticketId, userId, content) {
    const tickets = this.getTickets();
    const resolvedKey = this.resolveTicketKey(ticketId);
    if (resolvedKey && tickets[resolvedKey]) {
      tickets[resolvedKey].messages.push({
        userId: userId,
        content: content,
        timestamp: new Date().toISOString()
      });
      this.saveTickets(tickets);
    }
  }

  // Auto cleanup old closed tickets
  cleanup() {
    const tickets = this.getTickets();
    const now = new Date();
    let deletedCount = 0;

    for (const ticketId in tickets) {
      const ticket = tickets[ticketId];
      if (ticket.status === 'closed') {
        const createdDate = new Date(ticket.createdAt);
        const ageInDays = (now - createdDate) / (1000 * 60 * 60 * 24);
        
        if (ageInDays > config.AUTO_CLEANUP_DAYS) {
          delete tickets[ticketId];
          deletedCount++;
        }
      }
    }

    if (deletedCount > 0) {
      this.saveTickets(tickets);
      console.log(`🧹 Cleaned ${deletedCount} old tickets`);
    }

    return deletedCount;
  }

  // Get user open ticket count
  getUserOpenTickets(userId, guild = null) {
    const tickets = this.getTickets();
    let userTickets = Object.values(tickets).filter(t => 
      t.userId === userId && t.status === 'open'
    );

    if (guild) {
      userTickets = userTickets.filter(ticket => {
        const channelName = ticket.channelName || ticket.displayId;
        return guild.channels.cache.some(channel => channel.name === channelName);
      });
    }

    return userTickets;
  }

  syncOpenTickets(guild) {
    const tickets = this.getTickets();
    let changedCount = 0;

    Object.values(tickets).forEach(ticket => {
      if (ticket.status === 'open') {
        const channelName = ticket.channelName || ticket.displayId;
        const exists = guild.channels.cache.some(channel => channel.name === channelName);
        if (!exists) {
          ticket.status = 'closed';
          changedCount++;
        }
      }
    });

    if (changedCount > 0) {
      this.saveTickets(tickets);
    }

    return changedCount;
  }

  cleanMissingTickets(guild) {
    const tickets = this.getTickets();
    let deletedCount = 0;

    for (const ticketId in tickets) {
      const ticket = tickets[ticketId];
      const channelName = ticket.channelName || ticket.displayId;
      const exists = guild.channels.cache.some(channel => channel.name === channelName);

      if (!exists) {
        delete tickets[ticketId];
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      this.saveTickets(tickets);
    }

    return deletedCount;
  }
}

module.exports = new TicketManager();
