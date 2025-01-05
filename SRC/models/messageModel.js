const db = require("../config/db");

module.exports = {
  // Send a message
  async sendMessage(sender_id, receiver_id, message_text) {
    const [result] = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)',
      [sender_id, receiver_id, message_text]
    );
    return result.insertId;
  },

  // get all messages between two users
  async getConversation(user_id1, user_id2) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
         ORDER BY timestamp DESC`,
        [user_id1, user_id2, user_id2, user_id1]
      );
      return rows;
    } catch (err) {
      console.error("Error executing query:", err);
      throw err; // Rethrow the error to be caught by the controller
    }
  },
};
