const db = require('../config/db');

module.exports = {

  // get all pets
  async getAllPets() {
    const [pets] = await db.query('SELECT * FROM Pets');
    return pets;
  },

  // create a new pet
  async createPet(trainer_id, pet_name, species, base_skillpoints) {
    const [result] = await db.query(
      'INSERT INTO Pets (trainer_id, pet_name, species, base_skillpoints) VALUES (?, ?, ?, ?)',
      [trainer_id, pet_name, species, base_skillpoints]
    );
    return result.insertId;
  },

  // train a pet
  async trainPet(pet_id, training_skillpoints) {
    const [pet] = await db.query('SELECT * FROM Pets WHERE pet_id = ?', [pet_id]);
    if (!pet) throw new Error('Pet not found');

    // calculate new level
    const [training] = await db.query(
      'SELECT SUM(training_skillpoints) AS total_skillpoints FROM PetTraining WHERE pet_id = ?',
      [pet_id]
    );
    const totalSkillpoints = (training.total_skillpoints || 0) + training_skillpoints;
    const newLevel = Math.floor(totalSkillpoints / 50) + 1;

    // update training record
    await db.query('INSERT INTO PetTraining (pet_id, training_skillpoints, level) VALUES (?, ?, ?)', [
      pet_id,
      training_skillpoints,
      newLevel
    ]);

    return { pet_id, new_level: newLevel };
  },

  async getPetById(pet_id) {
    const [rows] = await db.query('SELECT * FROM Pets WHERE pet_id = ?', [pet_id]);
    return rows[0];
  },

  async addTraining(pet_id, training_skillpoints) {
    await db.query('INSERT INTO PetTraining (pet_id, training_skillpoints) VALUES (?, ?)', [pet_id, training_skillpoints]);
  },

  async getTotalTrainingSkillpoints(pet_id) {
    const [result] = await db.query('SELECT SUM(training_skillpoints) AS total FROM PetTraining WHERE pet_id = ?', [pet_id]);
    return result[0].total || 0; // return 0 if no training records exist
  },

  // start a battle between two pets
  async startBattle(challenger_pet_id, opponent_pet_id) {
    const [challenger] = await db.query('SELECT * FROM Pets WHERE pet_id = ?', [challenger_pet_id]);
    const [opponent] = await db.query('SELECT * FROM Pets WHERE pet_id = ?', [opponent_pet_id]);

    if (!challenger || !opponent) throw new Error('One or both pets not found');

    // fetch levels
    const [challengerTraining] = await db.query(
      'SELECT SUM(training_skillpoints) AS total_skillpoints FROM PetTraining WHERE pet_id = ?',
      [challenger_pet_id]
    );
    
    const [opponentTraining] = await db.query(
      'SELECT SUM(training_skillpoints) AS total_skillpoints FROM PetTraining WHERE pet_id = ?',
      [opponent_pet_id]
    );

    const challengerSkillpoints = challengerTraining[0]?.total_skillpoints || 0;
    const opponentSkillpoints = opponentTraining[0]?.total_skillpoints || 0;

    // decide winner
    const winner_pet_id = challengerSkillpoints >= opponentSkillpoints ? challenger_pet_id : opponent_pet_id;

    // save battle record
    await db.query(
      'INSERT INTO PetBattles (challenger_pet_id, opponent_pet_id, winner_pet_id) VALUES (?, ?, ?)',
      [challenger_pet_id, opponent_pet_id, winner_pet_id]
    );

    return { winner_pet_id, message: `Pet ${winner_pet_id} wins the battle!` };
  },

  // get all pets of a user
  async getPetsByTrainer(trainer_id) {
    const [pets] = await db.query('SELECT * FROM Pets WHERE trainer_id = ?', [trainer_id]);
    return pets;
  },

  // Update pet name in the database
  async updatePetName(pet_id, newPetName) {
    const [result] = await db.query(
      'UPDATE Pets SET pet_name = ? WHERE pet_id = ?',
      [newPetName, pet_id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Pet not found');
    }
    return newPetName;
  },

  // get battle history of a trainer
  async getBattleHistory(trainer_id) {
    const [battles] = await db.query(
      `SELECT * FROM PetBattles WHERE challenger_pet_id IN (SELECT pet_id FROM Pets WHERE trainer_id = ?) OR opponent_pet_id IN (SELECT pet_id FROM Pets WHERE trainer_id = ?);`,
      [trainer_id, trainer_id]
    );
    return battles;
  }
};
