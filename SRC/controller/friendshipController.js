const friendshipModel = require('../models/friendshipModel');
const responseView = require('../views/responseView');
const db = require('../config/db');

module.exports = {
  // add a friend
  async addFriend(req, res) {
    try {
      const { user_id, friend_id } = req.body;


      if (!user_id || !friend_id) {
       return responseView.sendError(res, null, 'Missing Required Fields', 404);
      }

      const [existingFriendship1] = await db.query(
        "SELECT * FROM friends WHERE user_id = ? AND friend_id = ?",
        [user_id, friend_id]
      );
  
      const [existingFriendship2] = await db.query(
        "SELECT * FROM friends WHERE user_id = ? AND friend_id = ?",
        [friend_id, user_id]
      );
  
      // if either of these queries returns a result, the users are already friends
      if (existingFriendship1.length > 0 || existingFriendship2.length > 0) {
        return responseView.sendError(res, null, 'Already friends', 409);
      }
  
      // ensure both friendships are added atomically
      await db.query('START TRANSACTION');
  
      // add user_id -> friend_id
      await db.query(
        "INSERT INTO friends (user_id, friend_id) VALUES (?, ?)",
        [user_id, friend_id]
      );
  
      // add friend_id -> user_id to make the friendship mutual
      await db.query(
        "INSERT INTO friends (user_id, friend_id) VALUES (?, ?)",
        [friend_id, user_id]
      );
  
      // commit transaction if both operations are successful
      await db.query('COMMIT');

  
      responseView.sendSuccess(res, "Friend Added Successfully", 201);
  
    } catch (error) {
      return responseView.sendError(res, null, 'Invalid ID', 500);
    }
  },

  // get all friends
  async getFriends(req, res) {
    try {
      // get user_id from the route parameter
      const user_id = req.params.user_id;
  
      // check if the user exists in the database
      const [user] = await db.query("SELECT * FROM user WHERE user_id = ?", [user_id]);
  
      // if user does not exist, return an error message
      if (!user || user.length === 0) {
        return responseView.sendError(res, null, 'Invalid id', 404);
      }
  
      // retrieve friends using the user_id
      const friends = await friendshipModel.getFriends(user_id);
  
      // send the list of friends as the response
      responseView.sendSuccess(res, friends);
    } catch (err) {
      console.error("Error fetching friends:", err);
      return responseView.sendError(res, null, 'Failed to fetch friends', 500);
    }
  },
  

  // remove a friend
  async removeFriend(req, res) {
    try {
      const user_id = req.params.user_id;
      const { friend_id } = req.body;
  
      // Ensure both user_id and friend_id are provided
      if (!user_id || !friend_id) {
        return responseView.sendError(res, null, "User ID and Friend ID are required.", 400);
      }
  
      // Check if the user exists in the database
      const [user] = await db.query("SELECT * FROM user WHERE user_id = ?", [user_id]);
  
      // If user does not exist, return an error message
      if (!user || user.length === 0) {
        return responseView.sendError(res, null, 'Invalid ID', 500);
      }
  
      // Check if the two users are already friends
      const isAlreadyFriends = await friendshipModel.checkFriendship(user_id, friend_id);
      if (!isAlreadyFriends) {
        return responseView.sendError(res, null, 'Not friends', 404);
      }
  
      // Proceed with removing the friend relationship
      await friendshipModel.removeFriend(user_id, friend_id);
  
      // Send success response
      responseView.sendSuccess(res, { message: 'Friend removed successfully' }, 200);
    } catch (err) {
      console.error("Error removing friend:", err);
      responseView.sendError(res, 'Failed to remove friend', err);
    }
}
};  
