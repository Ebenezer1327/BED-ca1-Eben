const db = require("./db.js");

(async () => {
    try {
        const SQLSTATEMENT = `
        DROP TABLE IF EXISTS User;
        CREATE TABLE User (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username TEXT,
        skillpoints INT
        email VARCHAR(255) NOT NULL UNIQUE;
        password VARCHAR(255) NOT NULL;
        );

        DROP TABLE IF EXISTS FitnessChallenge;
        CREATE TABLE FitnessChallenge (
        challenge_id INT AUTO_INCREMENT PRIMARY KEY,
        creator_id INT NOT NULL,
        challenge TEXT NOT NULL,
        skillpoints INT NOT NULL
        );


        INSERT INTO fitnesschallenge (creator_id, challenge_name, challenge, skillpoints)
        VALUES 
            (0, 'Run 5km in under 30 minutes', 50),
            (0, 'Complete 50 push-ups in one session', 100),
            (0, 'Hold a plank for 3 minutes', 200);

        
        DROP TABLE IF EXISTS UserCompletion;
        CREATE TABLE UserCompletion (
        complete_id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_id INT NOT NULL,
        user_id INT NOT NULL,
        completed BOOL NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
        );

        DROP TABLE IF EXISTS class;
        CREATE TABLE class (
            class_id INT AUTO_INCREMENT PRIMARY KEY,
            class TEXT NOT NULL,
            description TEXT NOT NULL,
            hp INT NOT NULL,
            atk INT NOT NULL,
            atk_spd FLOAT NOT NULL,
            movement_spd FLOAT NOT NULL,
            energy INT NOT NULL,
            mana INT NOT NULL,
            passive TEXT NOT NULL,
            skill1 TEXT NOT NULL,
            skill2 TEXT NOT NULL
        );

        INSERT INTO class (class, description, hp, atk, atk_spd, movement_spd, energy, mana, passive, skill1, skill2)
        VALUES 
            ('Assassin', 'A stealthy and agile class specializing in speed and precision. Assassins deal high burst damage through critical strikes and excel at eliminating targets quickly before retreating.', 180, 30, 2.5, 1.5, 100, 0, 'Shadow Strike', "Poison blade", "Intimidation"),
            ('Warrior', ' A melee-focused class known for high durability and strength. Warriors excel in close combat, wielding swords, axes, or shields, and often serve as tanks or front-line fighters.', 350, 40, 1.2, 1, 100, 0, 'Heavy weapons mastery', "Last stand", "Warrior's Rage"),
            ('Mage', 'A magic-based class with powerful ranged abilities. Mages cast destructive spells, control the battlefield with elemental magic, and often trade defense for devastating offensive power.', 200, 50, 1.8, 1.1, 0, 100, 'Time Capsule', 'Fireball', 'Meteor Strike'),
            ('Summoner', 'A versatile class that calls forth creatures or spirits to fight alongside them. Summoners excel in controlling minions to overwhelm enemies or support allies.', 250, 15, 1.5, 1.1, 0, 100, 'Spirit bond', 'Spirit summons', 'King of spirit'),
            ('Archer', 'A ranged physical damage class with exceptional accuracy and mobility. Archers use bows or crossbows to deal consistent damage from afar.', 200, 40, 2, 1.4, 100, 0, "Hunter's Instinct", 'Rapid fire', 'Explosive Shot');
        DROP TABLE IF EXISTS gear;
        CREATE TABLE gear (
            gear_id INT AUTO_INCREMENT PRIMARY KEY,
            item TEXT NOT NULL,
            item_desc TEXT NOT NULL,
            stat TEXT,
            effect FLOAT,
            part TEXT NOT NULL,
            category TEXT NOT NULL,
            rarity TEXT NOT NULL
            );

        INSERT INTO gear (item,item_desc,stat,effect,part,category,rarity)
        VALUES
            ('Forgeguard Helm', 'Increases health by 10%', 'hp', 0.10, 'helmet', 'armor', 'Common'),
            ('Battleforged Crown', 'Increases health by 30%', 'hp', 0.30, 'helmet', 'armor', 'Rare'),
            ('Arcane Circlet', 'Increases mana by 15%', 'mana', 0.15, 'helmet', 'armor', 'Common'),
            ('Windrunner Helm', 'Increases movement speed by 20%', 'movement_spd', 0.20, 'helmet', 'armor', 'Rare'),
            ('Ironheart Chestguard', 'Increases health by 50%', 'hp', 0.50, 'chestplate', 'armor', 'Legendary'),
            ('Robes Of Mystic Flow', 'Increases mana by 25%', 'mana', 0.25, 'chestplate', 'armor', 'Rare'),
            ('Plate Of The Colossus', 'Increases energy by 40%', 'energy', 0.40, 'chestplate', 'armor', 'Epic'),
            ('Phantomweave Garb', 'Increases attack speed by 20%', 'atk_spd', 0.20, 'chestplate', 'armor', 'Rare'),
            ('Greaves Of Titan Might', 'Increases health by 25%', 'hp', 0.25, 'leggings', 'armor', 'Epic'),
            ('Shadowstep Leggings', 'Increases movement speed by 20%', 'movement_spd', 0.20, 'leggings', 'armor', 'Rare'),
            ('The Titan Prosthetic', 'Increases health by 60%', 'hp', 0.60, 'leggings', 'armor', 'Legendary'),
            ('Enigmatic Leggings', 'Increases mana by 25%', 'mana', 0.25, 'leggings', 'armor', 'Rare'),
            ('Ironfang Protector', 'Increases energy by 30%', 'energy', 0.30, 'leggings', 'armor', 'Rare'),
            ('Warblade Of Unyielding Fury', 'Increases attack by 20%', 'atk', 0.20, 'weapon', 'sword', 'Rare'),
            ('Bloodhowl Axe', 'Increases attack by 30%', 'atk', 0.30, 'weapon', 'axe', 'Epic'),
            ('Silent Reaper Dagger', 'Increases attack by 60%', 'atk', 0.60, 'weapon', 'dagger', 'Legendary'),
            ('Starlight Scepter', 'Increases mana by 90%', 'mana', 0.90, 'weapon', 'wand', 'Epic'),
            ('Soulflame Wand', 'Increases attack by 50%', 'atk', 0.50, 'weapon', 'wand', 'Legendary'),
            ('Bow Of Whispering Winds', 'Increases attack speed by 60%', 'atk_spd', 0.60, 'weapon', 'bow', 'Legendary'),
            ('Vortex Longbow', 'Increases attack by 60%', 'atk', 0.60, 'weapon', 'bow', 'Legendary'),
            ('Wooden Sword', 'No effect', null, null, 'weapon', 'sword', 'Common'),
            ('Wooden Dagger', 'No effect', null, null, 'weapon', 'dagger', 'Common'),
            ('Wooden Wand', 'No effect', null, null, 'weapon', 'wand', 'Common'),
            ('Wooden Bow', 'No effect', null, null, 'weapon', 'bow', 'Common');
            
        DROP TABLE IF EXISTS dungeon;
        CREATE TABLE dungeon (
            dungeon_id INT AUTO_INCREMENT PRIMARY KEY,
            dungeon_name TEXT NOT NULL,
            dungeon_desc TEXT NOT NULL,
            min_lvl INT NOT NULL,
            drops JSON NOT NULL,
            gold INT NOT NULL,
            pet_lvl INT NOT NULL
            );
            
        INSERT INTO dungeon (dungeon_name, dungeon_desc, min_lvl, drops, gold, pet_lvl)
        VALUES
            ('Shouki no Kami', "Shouki no Kami, as an artificial divinity created using all the might of Sumeru's Six Darshans, has power that rivals that of true gods.", 11, '["The Titan Prosthetic","Vortex Longbow","Greaves Of Titan Might"]', 400, 4),
            ('Stormterror', 'With the passages of long years and amid boudless darkness, even the purest gem will become dulled by dust, and even the noble dragon might be corrupted and cankered by hatred.', 0, '["Forgeguard Helm","Enigmatic Leggings","Windrunner Helm"]', 50, 1),
            ('Darkbringer', 'He draws power from the ominous Delusion, he possesses and fights using martial arts that he learned in the land of darkness.', 0, '["Battleforged Crown","Greaves Of Titan Might","Robes Of Mystic Flow"]', 50, 1),
            ('Azhdaha', "The faint rattling of this dragon lord's shackles and his deep, angry growl echo through the bowels of the mountains like memories of a bygone era.", 3, '["Warblade Of Unyielding Fury","Bloodhowl Axe","Starlight Scepter"]', 120, 2),
            ('World Devourer', "the All-Devouring Narwhal is uncooperative, eats too much, and overall fails as a pet.", 3, '["Silent Reaper Dagger","Soulflame Wand","Bow Of Whispering Winds"]', 120, 2),
            ('Eroded Ifrit', "A fell dragon, congealed from the power of pitch-black darkness. Habouring the power of a mythology creature, Ifrit.", 6, '["Arcane Circlet","Phantomweave Garb","Ironfang Protector"]', 200, 3),
            ('Oasis Primal', "A guardian for an oasis which have been forgotten by its own master and people. However, it's loyalty remains and he continues to safeguard the oasis.", 6, '["Ironheart Chestguard","Plate Of The Colossus","Shadowstep Leggings"]', 200, 3);
            
        DROP TABLE IF EXISTS characters;
        CREATE TABLE characters (
            character_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            character_name TEXT NOT NULL,
            character_class TEXT NOT NULL,
            faction TEXT NOT NULL,
            lvl INT NOT NULL,
            weapon TEXT NOT NULL,
            helmet TEXT,
            chestplate TEXT,
            leggings TEXT,
            hp INT NOT NULL,
            atk INT NOT NULL,
            atk_spd INT NOT NULL,
            movement_spd FLOAT NOT NULL,
            energy INT NOT NULL,
            mana INT NOT NULL,
            passive TEXT NOT NULL,
            skill1 TEXT NOT NULL,
            skill2 TEXT NOT NULL,
            pet_name TEXT NOT NULL,
            pet_lvl INT NOT NULL
            );
            
        DROP TABLE IF EXISTS inventory;
        CREATE TABLE inventory (
            inventory_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            items JSON NOT NULL,
            gold INT NOT NULL
            );

        DROP TABLE IF EXISTS pet;
        CREATE TABLE pet (
            pet_id INT AUTO_INCREMENT PRIMARY KEY,
            pet_1st_evolution TEXT NOT NULL,
            pet_2nd_evolution TEXT NOT NULL,
            pet_3rd_evolution TEXT NOT NULL,
            pet_desc TEXT NOT NULL
            );
            
        INSERT INTO pet (pet_1st_evolution, pet_2nd_evolution, pet_3rd_evolution, pet_desc)
        VALUES
            ("Eclipse Fox", "Twilight Prowler", "Nine Tailed Fox", "A sleek, orange demon fox with nine tails"),
            ("Hatchon", "Dark Drake", "E.N.D Dragon", "A mystical dragon king covered in black scales and spiraling blue markings"),
            ("Starbound Wolf", "Celestial Wolf", "Eclipse Howler", "A wolf cub with a shimmering coat that looks like the night sky."),
            ("Shadow Minion", "Shadow Recruit", "Shadow Soldier", "A loyal, respectful, and chivalrous shadow soldier"),
            ("Undead", "Undead Mage", "Skeleton King", "An undead skeleton who is devoid of skin and flesh with exceptional magic skills");

        DROP TABLE IF EXISTS dungeoncompletion;
        CREATE TABLE dungeoncompletion (
            complete_id INT AUTO_INCREMENT PRIMARY KEY,
            dungeon_id INT NOT NULL,
            character_id INT NOT NULL,
            creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
        DROP TABLE IF EXISTS faction;
        CREATE TABLE faction (
            faction_id INT AUTO_INCREMENT PRIMARY KEY,
            faction_name TEXT NOT NULL,
            faction_desc TEXT NOT NULL,
            min_lvl INT NOT NULL,
            owner_character_id INT NOT NULL,
            owner_name TEXT NOT NULL,
            members JSON NOT NULL
            );
            
        DROP TABLE IF EXISTS market;
        CREATE TABLE market (
            auction_item_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            username TEXT NOT NULL,
            item TEXT NOT NULL,
            price INT NOT NULL
            );
            
        DROP TABLE IF EXISTS transactioncompletion;
        CREATE TABLE transactioncompletion (
            transaction_id INT AUTO_INCREMENT PRIMARY KEY,
            auction_item_id INT NOT NULL,
            buyer_user_id INT NOT NULL,
            seller_user_id INT NOT NULL,
            transacted_item TEXT NOT NULL,
            price INT NOT NULL,
            transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
        DROP TABLE IF EXISTS reviews;
        CREATE TABLE reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            username TEXT NOT NULL,
            review_amt INT NOT NULL,
            review_msg TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        INSERT INTO reviews (user_id, username, review_amt, review_msg)
        VALUES
            (0, 'John', 4, 'This RPG offers deep storytelling, engaging combat, and rich world-building. Character progression feels rewarding, and side quests add depth. A must-play for fans of immersive role-playing experiences!'),
            (0, 'Darren', 5, 'A masterpiece of storytelling and exploration, this RPG blends strategic combat, rich lore, and meaningful choices. The world feels alive, and every decision shapes your journey. Truly unforgettable!'),
            (0, 'Jason', 3, 'A solid RPG with a great world and fun combat, but the pacing drags, and side quests feel repetitive. Characters are interesting, but the story lacks emotional depth. Decent, but not amazing.');
        `

        await db.query(SQLSTATEMENT)
        console.log('Tables has been created successfully')
        process.exit()
    } catch (err) {
        console.error("Tables operation error:", err)
        process.exit()
    }
})();