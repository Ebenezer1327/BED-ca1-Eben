const db = require("../config/db");

module.exports = {
    async getAllUsers() {
        const [rows] = await db.query('SELECT * FROM user');
        return rows;
    },
    async createUser(username, skillpoints) {
        const [result] = await db.query('INSERT INTO user (username, skillpoints) VALUES (?, ?)', [username, skillpoints]);
        return result.insertId; // insertId is a small object used
    },
      async checkUsernameExists(username) {
        const [rows] = await db.query('SELECT 1 FROM user WHERE username = ?', [username]);
        return rows.length > 0; // return boolean true if user have username already exist
    },
      async getUserById(user_id) {
        const [rows] = await db.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
        return rows;
    },
      async updateSkillPoints(user_id, skillpoints) {
        try {
            await db.query('UPDATE user SET skillpoints = ? WHERE user_id = ?', [skillpoints, user_id]);
        } catch (error) {
            console.error('Error updating skill points:', error.message);
            throw new Error('Failed to update skill points');
        }
    },    
      async updateUser(user_id, username, skillpoints) {
        // Check if the user exists
        const [userExists] = await db.query('SELECT * FROM user WHERE user_id = ?', [user_id]);
        if (userExists.length === 0) {
            throw new Error('User not found'); // throw error if user id dont exist
        }
    
          // checking if the username is already taken
        const [usernameExists] = await db.query('SELECT * FROM user WHERE username = ? AND user_id != ?', [username, user_id]);
        if (usernameExists.length > 0) {
            throw new Error('Username already taken'); // throw error for user to see if it is already taken
        }
    
        // continue updating if user is not taken 
        await db.query('UPDATE user SET username = ?, skillpoints = ? WHERE user_id = ?', [username, skillpoints, user_id]);
    },
      async deleteUser(user_id) {
        await db.query('DELETE FROM user WHERE user_id = ?', [user_id]);
    },
}