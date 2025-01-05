const db = require("../config/db");


module.exports = {
  async getAllChallenges() {
      const [rows] = await db.query('SELECT * FROM fitnesschallenge');
      return rows;
  },

  async getChallengeById(challenge_id) {
      const [rows] = await db.query('SELECT * FROM fitnesschallenge WHERE challenge_id = ?', [challenge_id]);
      return rows[0];
  },

  async createChallenge(challenge, creator_id, skillpoints) {
      try {
          const [result] = await db.query(
              `INSERT INTO fitnesschallenge (challenge, creator_id, skillpoints) VALUES (?, ?, ?)`, 
              [challenge, creator_id, skillpoints]
          );
          return result.insertId;
      } catch (error) {
          console.error('Error creating challenge:', error.message);
          throw new Error('Failed to create challenge');
      }
  },

  async updateChallenge(challenge_id, challenge, creator_id, skillpoints) {
      await db.query('UPDATE fitnesschallenge SET challenge = ?, creator_id = ?, skillpoints = ? WHERE challenge_id = ?', [challenge, creator_id, skillpoints, challenge_id]);
  },

  async deleteChallenge(challenge_id) {
      await db.query('DELETE FROM fitnesschallenge WHERE challenge_id = ?', [challenge_id]);
  },

  async createCompletion(user_id, challenge_id, completed, creation_date, notes) {
      try {
          const [result] = await db.query(
              `INSERT INTO usercompletion (challenge_id, user_id, completed, creation_date, notes) VALUES (?, ?, ?, ?, ?)`, 
              [challenge_id, user_id, completed, creation_date, notes]
          );
          return result.insertId;
      } catch (error) {
          console.error('Error creating completion:', error.message);
          throw new Error('Failed to create completion');
      }
  },

  async getParticipantsByChallengeId(challenge_id) {
      try {
          const [rows] = await db.query(
              'SELECT user_id, creation_date, completed, notes FROM usercompletion WHERE challenge_id = ?',
              [challenge_id]
          );
          return rows;
      } catch (error) {
          console.error('Error fetching participants:', error.message);
          throw new Error('Failed to fetch participants');
      }
  },
};
