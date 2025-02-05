const messageModel = require('../models/messageModel');
const responseView = require('../views/responseView');
const friendshipModel = require('../models/friendshipModel'); // Assuming this model handles friendships
const db = require('../config/db');

module.exports = {
  // Send a message
  async sendMessage(req, res) {
    try {
      const { sender_id, receiver_id, message_text } = req.body;

      console.log("Message Text:", message_text);

      // Validate message text
      if (!message_text || message_text.trim() === '') {
        return responseView.sendError(res, null, 'Message text is required', 400); // 400 Bad Request
      }

      // Check if sender and receiver are friends
      const isFriend = await friendshipModel.checkFriendship(sender_id, receiver_id);
      
      if (!isFriend) {
        // If they are not friends, return an error
        console.log("Sender and receiver are not friends:", { sender_id, receiver_id });
        return responseView.sendError(res, null, 'You can only send messages to your friends', 403); // 403 Forbidden
      }

      // If they are friends, send the message
      const message_id = await messageModel.sendMessage(sender_id, receiver_id, message_text);
      responseView.sendSuccess(res, { message_id, receiver_id, message_text }, 201);
    } catch (err) {
      responseView.sendError(res, 'Failed to send message', err);
    }
  },

  // Get conversation between two users
async getConversation(req, res) {
  try {
    const user_id = req.params.user_id;
    const friend_id = req.query.friend_id; // Changed to access query parameter

    // Ensure both user_id and friend_id are provided
    if (!user_id || !friend_id) {
      return responseView.sendError(res, null, "User ID and Friend ID are required.", 400);
    }

    console.log("Fetching conversation between", user_id, "and", friend_id);

    // Check if the user exists in the database
    const [user] = await db.query("SELECT * FROM user WHERE user_id = ?", [user_id]);
    if (!user || user.length === 0) {
      return responseView.sendError(res, null, "Invalid user_id", 500);
    }

    // Check if the friend exists in the database
    const [friend] = await db.query("SELECT * FROM user WHERE user_id = ?", [friend_id]);
    if (!friend || friend.length === 0) {
      return responseView.sendError(res, null, "Invalid friend_id", 500);
    }

    // Fetch the messages between the two users
    const messages = await messageModel.getConversation(user_id, friend_id);
    
    // Send success response with the conversation
    responseView.sendSuccess(res, messages);
  } catch (err) {
    console.error("Error fetching conversation:", err);
    responseView.sendError(res, 'Failed to fetch conversation', err);
  }
}
};
