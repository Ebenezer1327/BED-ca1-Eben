const db = require("./db.js");
require('dotenv').config();

(async () => {
    try {
        const SQLSTATEMENT = `

         SET FOREIGN_KEY_CHECKS = 0;

        -- Then, drop the tables
        DROP TABLE IF EXISTS UserCompletion;
        DROP TABLE IF EXISTS FitnessChallenge;
        DROP TABLE IF EXISTS friends;
        DROP TABLE IF EXISTS messages;
        DROP TABLE IF EXISTS Reviews;
        DROP TABLE IF EXISTS petbattles;
        DROP TABLE IF EXISTS pettraining;
        DROP TABLE IF EXISTS pets;
        DROP TABLE IF EXISTS User;

        SET FOREIGN_KEY_CHECKS = 1;
        
        CREATE TABLE User (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username TEXT,
        skillpoints INT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
        );


       
        CREATE TABLE FitnessChallenge (
        challenge_id INT AUTO_INCREMENT PRIMARY KEY,
        creator_id INT NOT NULL,
        challenge TEXT NOT NULL,
        skillpoints INT NOT NULL
        );


        INSERT INTO fitnesschallenge (creator_id, challenge, skillpoints)
        VALUES 
            (0, 'Run 5km in under 30 minutes', 50),
            (0, 'Complete 50 push-ups in one session', 100),
            (0, 'Hold a plank for 3 minutes', 200);

        
        
        CREATE TABLE UserCompletion (
        complete_id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        user_id INT NOT NULL,
        completed BOOL NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
        );

        
        CREATE TABLE pets (
        pet_id int NOT NULL AUTO_INCREMENT,
        pet_name varchar(100) NOT NULL,
        species varchar(50) NOT NULL,
        base_skillpoints int NOT NULL,
        trainer_id int NOT NULL,
        PRIMARY KEY (pet_id),
        KEY trainer_id (trainer_id),
        CONSTRAINT pets_ibfk_1 FOREIGN KEY (trainer_id) REFERENCES user (user_id)
        );


       
        
        CREATE TABLE pettraining (
        training_id int NOT NULL AUTO_INCREMENT,
        pet_id int NOT NULL,
        training_skillpoints int NOT NULL,
        level int NOT NULL DEFAULT 1,
        PRIMARY KEY (training_id),
        KEY pet_id (pet_id),
        CONSTRAINT pettraining_ibfk_1 FOREIGN KEY (pet_id) REFERENCES pets (pet_id)
        );

        
            
        
        CREATE TABLE petbattles (
        battle_id int NOT NULL AUTO_INCREMENT,
        challenger_pet_id int NOT NULL,
        opponent_pet_id int NOT NULL,
        winner_pet_id int NOT NULL, 
        battle_date timestamp NULL DEFAULT CURRENT_TIMESTAMP, 
        PRIMARY KEY (battle_id),
        KEY challenger_pet_id (challenger_pet_id),
        KEY opponent_pet_id (opponent_pet_id),
        KEY winner_pet_id (winner_pet_id),
        CONSTRAINT petbattles_ibfk_1 FOREIGN KEY (challenger_pet_id) REFERENCES pets (pet_id),
        CONSTRAINT petbattles_ibfk_2 FOREIGN KEY (opponent_pet_id) REFERENCES pets (pet_id),
        CONSTRAINT petbattles_ibfk_3 FOREIGN KEY (winner_pet_id) REFERENCES pets (pet_id)
        );
            
       

        
        CREATE TABLE Reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        review_amt INT NOT NULL,
        user_id INT NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES User(user_id)
        );


            
        
        CREATE TABLE messages (
        message_id INT NOT NULL AUTO_INCREMENT,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message_text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (message_id),
        CONSTRAINT messages_ibfk_1 FOREIGN KEY (sender_id) REFERENCES user (user_id),
        CONSTRAINT messages_ibfk_2 FOREIGN KEY (receiver_id) REFERENCES user (user_id)
        );


        
        CREATE TABLE friends (
        user_id INT NOT NULL,
        friend_id INT NOT NULL,
        date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, friend_id),
        CONSTRAINT friends_ibfk_1 FOREIGN KEY (user_id) REFERENCES user (user_id),
        CONSTRAINT friends_ibfk_2 FOREIGN KEY (friend_id) REFERENCES user (user_id)
        );
        `

        await db.query(SQLSTATEMENT)
        console.log('Tables has been created successfully')
        process.exit()
    } catch (err) {
        console.error("Tables operation error:", err)
        process.exit()
    }
})();