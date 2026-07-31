const { dbStore } = require('../config/db');

class NotificationService {
  static io = null;

  static setSocketIO(ioInstance) {
    this.io = ioInstance;
  }

  static sendNotification({ recipientId, title, message, type = 'GENERAL', metaData = {} }) {
    const notification = {
      id: `NOTIF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      recipientId: recipientId || 'BROADCAST',
      title,
      message,
      type,
      metaData,
      isRead: false,
      timestamp: new Date().toISOString(),
    };

    dbStore.notifications.push(notification);

    if (this.io) {
      this.io.emit('notificationReceived', notification);
      if (recipientId) {
        this.io.to(recipientId).emit('notificationReceived', notification);
      }
    }

    return notification;
  }
}

module.exports = NotificationService;
