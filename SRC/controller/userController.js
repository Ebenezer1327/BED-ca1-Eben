const userModel = require('../models/userModel');
const responseView = require('../views/responseView');
const bcrypt = require('bcrypt');
 
module.exports = {
  async listUsers(req, res) {
    try {
      const users = await userModel.getAllUsers();
      responseView.sendSuccess(res, users);
    } catch (err) {
      responseView.sendError(res, 'Failed to fetch users', err);
    }
  },


  async registerUser(req, res) {
    try {
      const { username, email, password } = req.body;

      // Validate inputs
      if (!username || !email || !password) {
        return res.status(409).json({message: "All Fields required"});
      }

      const UsernameExists = await userModel.checkUsernameExists(username);
      if (UsernameExists) {
        return res.status(409).json({message: "Username already exist"});
      }


      // Check if email already exists
      const emailExists = await userModel.checkEmailExists(email);
      if (emailExists) {
        return res.status(409).json({message: "Email already exist"});
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save to database
      const userId = await userModel.createUser(username, email, hashedPassword);
      res.status(201).json({message: "User registered successfully!", user_id: userId, username, email });
    } catch (err) {
      res.status(500).json({message: "Failed to register"});
    }
  },

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // Validate inputs
      if (!email || !password) {
        return res.status(400).json({message: "Missing Field"});
      }

      // Fetch user from database
      const user = await userModel.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({message: "Invalid credentials"});
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({message: "Invalid credentials"});
      }

      // Return success response
      res.status(201).json({message: "User registered successfully!", user_id: user.id, username: user.username, email: user.email });
    } catch (err) {
      res.status(500).json({message: "Failed To Login"});
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

// Example Controllers for Token Management
preTokenGenerate(req, res, next) {
  res.locals.userId = req.body.id;
  next();
},

beforeSendToken(req, res, next) {
  res.locals.message = `Token is generated.`;
  next();
},

showTokenVerified(req, res, next) {
  res.status(200).json({
    userId: res.locals.userId,
    message: "Token is verified.",
  });
},
};
