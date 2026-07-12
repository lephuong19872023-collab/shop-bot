const TicketManager = require('../models/Ticket');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Ignore bot messages
    if (message.author.bot) return;

    // Log messages in ticket channels
    if (message.channel.name && message.channel.name.startsWith('🎫|')) {
      const ticketId = message.channel.name;
      TicketManager.addMessage(ticketId, message.author.id, message.content);
    }
  }
};
