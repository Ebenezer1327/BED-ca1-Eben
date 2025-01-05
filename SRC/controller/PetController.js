const petModel = require('../models/PetModel');
const userModel = require('../models/userModel');
const responseView = require('../views/responseView');

module.exports = {

  // get all pets
async getAllPets(req, res) {
  try {
    const pets = await petModel.getAllPets(); // This will fetch all pets

    if (!pets.length) {
      return responseView.sendError(res, null, 'No pets found', 404);
    }

    responseView.sendSuccess(res, pets, 200);
  } catch (err) {
    console.error('Error in getAllPets:', err);
    responseView.sendError(res, 'Failed to retrieve pets', err.message || err);
  }
},



  // create a new pet
  async createPet(req, res) {
    try {
      const { trainer_id, pet_name, species, base_skillpoints } = req.body;

      if (!trainer_id || !pet_name || !species || base_skillpoints === undefined) {
        return responseView.sendError(res, null, 'Missing required fields', 400);
      }

      const petId = await petModel.createPet(trainer_id, pet_name, species, base_skillpoints);
      responseView.sendSuccess(res, { pet_id: petId, trainer_id, pet_name, species, base_skillpoints }, 201);
    } catch (err) {
      responseView.sendError(res, 'Failed to create pet', err);
    }
  },

  // train a pet
  async trainPet(req, res) {
    try {
        const { training_skillpoints } = req.body;
        const petId = req.params.petId;

        console.log('Request Body:', req.body);
        console.log('Pet ID:', petId);

        // get details of pet
        const pet = await petModel.getPetById(petId);
        console.log('Pet Details:', pet);

        // get detail of user
        const user = await userModel.getUserById(pet.trainer_id);
        console.log('User Details:', user);

        if (!pet || !user) {
            return responseView.sendError(res, null, 'Pet or User not found', 404);
        }

        // check if user skillpoints is sufficient to train 
        if (user.skillpoints < training_skillpoints) {
            return responseView.sendError(res, null, 'Insufficient Skillpoint', 400);
        }

        // calculate remaining skillpoints after training
        const remainingSkillpoints = user.skillpoints - training_skillpoints;
        await userModel.updateSkillPoints(user.user_id, remainingSkillpoints);

        await petModel.addTraining(petId, training_skillpoints);

        const totalTrainingSkillpoints = await petModel.getTotalTrainingSkillpoints(petId);

        // how the model calulate the new level
        const newLevel = Math.floor(totalTrainingSkillpoints / 50) + 1;

        responseView.sendSuccess(res, {
            user: { user_id: user.user_id, skillpoints: remainingSkillpoints },
            pet: { pet_id: pet.pet_id, pet_name: pet.pet_name, total_training_skillpoints: totalTrainingSkillpoints, level: newLevel }
        });
    } catch (err) {
        console.error('Error in trainPet:', err); 
        responseView.sendError(res, 'Failed to train pet', err.message || err);
    }
},


  // start a pet battle
  async startBattle(req, res) {
    try {
      const { challenger_pet_id, opponent_pet_id } = req.body;

      if (!challenger_pet_id || !opponent_pet_id) {
        return responseView.sendError(res, null, 'Missing required fields', 400);
      }

      const battleResult = await petModel.startBattle(challenger_pet_id, opponent_pet_id);
      responseView.sendSuccess(res, battleResult, 200);
    } catch (err) {
      responseView.sendError(res, 'Failed to start battle', err);
    }
  },

  // get all pets of a user
  async getPets(req, res) {
    try {
        const trainerId = req.params.trainer_id;

        // get all pets for the trainer
        const pets = await petModel.getPetsByTrainer(trainerId);

        if (!pets.length) {
            return responseView.sendError(res, null, 'No pets found for this trainer', 404);
        }

        // add levels to each pet based on training skillpoints
        const petsWithLevels = await Promise.all(
            pets.map(async (pet) => {
                const totalTrainingSkillpoints = await petModel.getTotalTrainingSkillpoints(pet.pet_id);
                const level = Math.floor(totalTrainingSkillpoints / 50) + 1;

                return {
                    pet_id: pet.pet_id,
                    pet_name: pet.pet_name,
                    species: pet.species,
                    total_training_skillpoints: totalTrainingSkillpoints,
                    level: level
                };
            })
        );

        // send success response with status code 200
        responseView.sendSuccess(res, petsWithLevels, 200);
    } catch (err) {
        console.error('Error in getPets:', err);
        responseView.sendError(res, 'Failed to retrieve pets', err.message || err);
    }
},

// Update pet name
async updatePetName(req, res) {
  try {
    const { petId } = req.params;
    const { pet_name } = req.body;

    if (!pet_name) {
      return responseView.sendError(res, null, 'Pet name is required', 400);
    }

    const updatedName = await petModel.updatePetName(petId, pet_name);
    responseView.sendSuccess(res, { pet_id: petId, pet_name: updatedName }, 200);
  } catch (err) {
    console.error('Error in updatePetName:', err);
    responseView.sendError(res, 'Failed to update pet name', err.message || err);
  }
},



  // get battle history of a trainer
  async getBattleHistory(req, res) {
    try {
      const trainerId = req.params.trainer_id;
      const battles = await petModel.getBattleHistory(trainerId);
      responseView.sendSuccess(res, battles, 200);
    } catch (err) {
      responseView.sendError(res, 'Failed to retrieve battle history', err);
    }
  }
}