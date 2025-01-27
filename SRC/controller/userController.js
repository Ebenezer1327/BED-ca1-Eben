const userModel = require('../models/userModel');
const responseView = require('../views/responseView');
 
module.exports = {
  async listUsers(req, res) {
    try {
      const users = await userModel.getAllUsers();
      responseView.sendSuccess(res, users);
    } catch (err) {
      responseView.sendError(res, 'Failed to fetch users', err);
    }
  },

  async createUser(req, res) {
    try {
        // making skillpoints be default 0
        const { username, skillpoints = 0 } = req.body;

        // check if username is missing
        if (!username) {
            return responseView.sendError(res, null, 'Username is required', 400); // 400 Bad Request
        }

        // check if username already exists
        const userExists = await userModel.checkUsernameExists(username);
        if (userExists) {
            return responseView.sendError(res, null, 'Username is already taken', 409); // 409 Conflict
        }

        const userId = await userModel.createUser(username, skillpoints);
        return responseView.sendSuccess(
            res, { user_id: userId, username, skillpoints }, 201 
        );
    } catch (err) {
        responseView.sendError(res, 'Failed to create user', err, 500); // 500 Internal Server Error
    }
  },

  async getUser(req, res) {
    try {
      const user = await userModel.getUserById(req.params.id);
      if (!user) {
        return responseView.sendError(res, 'User not found', null, 404);
      }
      responseView.sendSuccess(res, user);
    } catch (err) {
      responseView.sendError(res, 'Failed to fetch user', err);
    }
  },

  async updateUser(req, res) {
    try {
        const { username, skillpoints } = req.body;
        const userId = req.params.id;

        await userModel.updateUser(userId, username, skillpoints);

        // return success response if update is successful
        return responseView.sendSuccess(res, { user_id: parseInt(userId), username, skillpoints });
    } catch (err) {
        // handle specific errors
        if (err.message === 'User not found') {
            return responseView.sendError(res, null, 'User ID not found', 404); // 404 Not Found
        } else if (err.message === 'Username already taken') {
            return responseView.sendError(res, null, 'Username is already taken', 409); // 409 Conflict
        }

        // handle other errors
        return responseView.sendError(res, 'Failed to update user', err, 500); // 500 Internal Server Error
    }
},

async deleteUser(req, res) {
  try {
    const user_id = req.params.id;

    // check if the user exists
    const user = await userModel.getUserById(user_id); 
    if (!user) {
      return responseView.sendError(res, 'User not found', null, 404);
    }

    // proceed with deletion
    await userModel.deleteUser(user_id);
    responseView.sendSuccess(res, { message: 'User deleted successfully' }, 200);

  } catch (err) {
    responseView.sendError(res, 'Failed to delete user', err);
  }
},

}