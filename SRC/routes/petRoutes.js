const express = require('express');
const petController = require('../controller/PetController');

const router = express.Router();

router.get('/', petController.getAllPets)
router.post('/', petController.createPet); 
router.get('/trainer/:trainer_id', petController.getPets); 


router.post('/:petId/train', petController.trainPet); 


router.post('/battles', petController.startBattle); 
router.get('/battles/trainer/:trainer_id', petController.getBattleHistory); 


router.put('/:petId/name', petController.updatePetName); 

module.exports = router;