const fitnessModel = require('../models/fitnessModel');
const userModel = require('../models/userModel');
const responseView = require('../views/responseView');
 
module.exports = {
  async listChallenges(req, res) {
    try {
        const challenges = await fitnessModel.getAllChallenges();

        // map over the array of challenges to format the response
        const responsePayload = challenges.map((challenge) => ({
            challenge_id: challenge.challenge_id,
            challenge: challenge.challenge,
            creator_id: challenge.creator_id,
            skillpoints: challenge.skillpoints,
        }));

        // send success response with status code 200
        responseView.sendSuccess(res, responsePayload, 200);
    } catch (err) {
        responseView.sendError(res, 'Failed to fetch challenges', err);
    }
},

  async createChallenge(req, res) {
    try {
        const { challenge, user_id, skillpoints } = req.body;

       
        if (!challenge || !user_id || skillpoints === undefined) {
            return responseView.sendError(res, null, 'Missing required fields:', 400);
        }

        const challengeId = await fitnessModel.createChallenge(challenge, user_id, skillpoints);

        // map over the array of challenges to format the response
        const responsePayload = {
            challenge_id: challengeId,  
            challenge,
            creator_id: user_id,
            skillpoints,
        };

        // send success response with status code 201
        responseView.sendSuccess(res, responsePayload, 201);
    } catch (err) {
        console.error('Error in createChallenge:', err.message);

        // handle errors and send error response
        responseView.sendError(res, 'Failed to create challenge', 500);
    }
},

async getChallengeById(req, res) {
  try {
    const fitness = await fitnessModel.getChallengeById(req.params.id);
    if (!fitness) {
      return responseView.sendError(res, null, 'challenge not found',  404);
    }
    responseView.sendSuccess(res, fitness);
  } catch (err) {
    responseView.sendError(res, 'Failed to fetch challenge', err);
  }
},

  async updateChallenge(req, res) {
    try {
        const { challenge, user_id, skillpoints } = req.body;
        const challengeId = parseInt(req.params.id);

        const fitness = await fitnessModel.getChallengeById(challengeId);
        if (!fitness) {
          return responseView.sendError(res, null, 'Challenge not found',  404);
        }

        if (!challenge || !user_id || skillpoints === undefined) {
          return responseView.sendError(res, null, 'Missing required fields:',  400);
      }

      if (fitness.creator_id != user_id ) {
        return responseView.sendError(res, null, 'Forbidden due to not correct creator', 403);
      }

        // update the challenge using the model
        await fitnessModel.updateChallenge(challengeId, challenge, user_id, skillpoints);

        // map over the array of challenges to format the response
        const responsePayload = {
            challenge_id: challengeId, 
            challenge,
            creator_id: user_id,
            skillpoints,
        };

        // send success response with status code 200
        responseView.sendSuccess(res, responsePayload, 200);
    } catch (err) {
        // handle errors and send an error response
        responseView.sendError(res, 'Failed to update challenge', err);
    }
},

  async deleteChallenge(req, res) {
    try {
      

      const challengeId = req.params.id;  

      const fitness = await fitnessModel.getChallengeById(challengeId); 
        if (!fitness) {
          return responseView.sendError(res, null, 'Challenge not found',  404);
        }

        await fitnessModel.deleteChallenge(req.params.id);


      responseView.sendSuccess(res, "Deleted Successfully", 204);
    } catch (err) {
      responseView.sendError(res, 'Failed to delete Challenge', err);
    }
  },








  // Completion section 



  async createCompletion(req, res) {
    try {
        const { user_id, completed, creation_date, notes } = req.body;
        const challengeId = (req.params.id);
        

      // checking required fields
      if (!user_id) {
          return responseView.sendError(res, null, 'Missing user_id:', 404);
      }

      const fitness = await fitnessModel.getChallengeById(challengeId);
        if (!fitness) {
          return responseView.sendError(res, null, 'Challenge not found',  404);
        }

        // Validate required fields
        if (!creation_date) {
          return responseView.sendError(res, null, 'Missing creation_date:', 400);
      }


      // skillPointsAwarded get what is assign in fitness.skillpoints if the task is completed, or 5 if it is not.
        let skillPointsAwarded = completed ? fitness.skillpoints : 5;

        // award skill points to the user
        const user = await userModel.getUserById(user_id);
        if (!user) {
            return responseView.sendError(res, null, 'User not found', 404);
        }

        const updatedSkillPoints = user.skillpoints + skillPointsAwarded;
        await userModel.updateSkillPoints(user_id, updatedSkillPoints);

      // model will insert the challenge into the database and get the challengeId
      const completeId = await fitnessModel.createCompletion(user_id, challengeId, completed, creation_date, notes);

         // map over the array of challenges to format the response with challenge_id included
         const responsePayload = {
            complete_id: completeId,  
            challenge_id: parseInt(challengeId),
            user_id: user_id,
            completed: completed,
            creation_date: creation_date,
            notes: notes,
        };

        // send success response with status code 201
        responseView.sendSuccess(res, responsePayload, 201);
    } catch (err) {
        console.error('Error in createCompletion:', err.message);

        // handle errors and send error response
        responseView.sendError(res, 'Failed to create challenge', 500);
    }
},





async getParticularChallengeById(req, res) {
  try {
    const challengeId = req.params.id; 

    // calling the model to get the participants of the challenge
    const participants = await fitnessModel.getParticipantsByChallengeId(challengeId);

    // check if any participants were found
    if (!participants || participants.length === 0) {
      return responseView.sendError(res, null, 'No participants found for this challenge', 404);
    }

    // check if any user attempted this challenge before
    if(!challengeId) {
      return responseView.sendError(res, null, 'No user attempt', 404);
    }

    // map over the array of challenges to format the response with challenge_id included
    const responsePayload = participants.map(participant => ({
      user_id: participant.user_id,
      completed:  Boolean(participant.completed),
      creation_date: participant.creation_date,
      notes: participant.notes,
    }));

    // send success response with status code 200
    responseView.sendSuccess(res, responsePayload, 200);
  } catch (err) {
    console.error('Error in getParticularChallengeById:', err.message);
    responseView.sendError(res, 'Failed to retrieve participants for the challenge', 500);
  }
}

};