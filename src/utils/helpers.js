class Utils {
  static generateTicketId(userId) {
    return `ticket-${userId}-${Date.now()}`;
  }

  static isValidTicketId(id) {
    return id.startsWith('ticket-');
  }

  static formatVietnamDate(date) {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static isStaff(member, staffRoleId) {
    return member.roles.cache.has(staffRoleId);
  }

  static async sendEphemeral(interaction, content) {
    return interaction.reply({
      content: content,
      ephemeral: true
    });
  }

  static getProductNameFromId(productId) {
    const products = {
      'decor_66_79k': 'Decor 66k / 79k VNĐ',
      'decor_79_105k': 'Decor 79k / 105k VNĐ',
      'decor_105_131k': 'Decor 105k / 131k VNĐ',
      'decor_118_136k': 'Decor 118k / 136k VNĐ',
      'decor_131_146k': 'Decor 131k / 146k VNĐ',
      'decor_141_189k': 'Decor 141k / 189k VNĐ'
    };
    return products[productId] || 'Unknown Product';
  }

  static getCategoryNameFromId(categoryId) {
    const categories = {
      'decor_gift': 'Decor Gift',
      'decor_66_79k': 'decor 66k / 79k vnđ',
      'decor_79_105k': 'decor 79k / 105k vnđ',
      'decor_105_131k': 'decor 105k / 131k vnđ',
      'decor_118_136k': 'decor 118k / 136k vnđ',
      'decor_131_146k': 'decor 131k / 146k vnđ',
      'decor_141_189k': 'decor 141k / 189k vnđ',
      'other': 'Khác'
    };
    return categories[categoryId] || 'Unknown Category';
  }

  static escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  static getTicketStatus(status) {
    const statuses = {
      'open': 'Đang mở',
      'closed': 'Đã đóng',
      'claimed': 'Được hỗ trợ'
    };
    return statuses[status] || status;
  }
}

module.exports = Utils;
