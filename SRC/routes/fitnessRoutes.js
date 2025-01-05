const express = require('express');
const fitnessController = require('../controller/fitnessController');

const router = express.Router();

router.get('/', fitnessController.listChallenges);
router.post('/', fitnessController.createChallenge);
router.put('/:id', fitnessController.updateChallenge);
router.delete('/:id', fitnessController.deleteChallenge);




// Complletion Section 


router.post('/:id', fitnessController.createCompletion);
router.get('/:id', fitnessController.getParticularChallengeById);

module.exports = router;
