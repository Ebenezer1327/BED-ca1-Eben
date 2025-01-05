const express = require('express');
const messageController = require('../controller/messageController');

const router = express.Router();


router.post('/send', messageController.sendMessage);

router.get('/conversation/:user_id', messageController.getConversation);

module.exports = router;
