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

// Routes for pets
router.post('/', petController.createPet); // Create a new pet
router.get('/trainer/:trainer_id', petController.getPets); // Get all pets for a trainer

// Routes for pet training
router.post('/:petId/train', petController.trainPet); // Train a specific pet

// Routes for pet battles
router.post('/battles', petController.startBattle); // Start a pet battle
router.get('/battles/trainer/:trainer_id', petController.getBattleHistory); // Get battle history for a trainer

module.exports = router;