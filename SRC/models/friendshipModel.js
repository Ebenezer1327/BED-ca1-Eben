const db = require("../config/db");

module.exports = {
  // Add a friend
  async addFriend(user_id, friend_id) {
    const [result] = await db.query(
      'INSERT INTO friends (user_id, friend_id) VALUES (?, ?)',
      [user_id, friend_id]
    );
    return result;
  },

  // Get all friends of a user
  async getFriends(user_id) {
    const [rows] = await db.query(
      `SELECT u.user_id, u.username FROM friends f
       JOIN user u ON f.friend_id = u.user_id
       WHERE f.user_id = ?`,
      [user_id]
    );
    return rows;
  },

  // Check if two users are already friends
  async checkFriendship(user_id, friend_id) {
    const [rows] = await db.query(
      'SELECT * FROM friends WHERE user_id = ? AND friend_id = ?',
      [user_id, friend_id]
    );
    return rows.length > 0;
  },

  // Remove a friend
  async removeFriend(user_id, friend_id) {
    const [result] = await db.query(
      'DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
      [user_id, friend_id, friend_id, user_id]
    );
    return result;
  }
};
