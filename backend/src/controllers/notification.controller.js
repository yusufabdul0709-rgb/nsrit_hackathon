const { dbStore } = require('../config/db');

exports.getNotifications = async (req, res) => {
  return res.status(200).json({
    success: true,
    notifications: dbStore.notifications.reverse(),
  });
};

exports.markAsRead = async (req, res) => {
  const { id } = req.body;
  if (id) {
    const notif = dbStore.notifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
  } else {
    dbStore.notifications.forEach((n) => (n.isRead = true));
  }

  return res.status(200).json({
    success: true,
    message: 'Notifications marked as read',
  });
};
