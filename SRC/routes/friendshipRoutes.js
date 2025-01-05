const express = require('express');
const friendshipController = require('../controller/friendshipController');


const router = express.Router();


// Add a friend
router.post('/add', friendshipController.addFriend);

// Get all friends of the logged-in user
router.get('/list/:user_id', friendshipController.getFriends);

// Remove a friend
router.delete('/remove/:user_id', friendshipController.removeFriend);

module.exports = router;