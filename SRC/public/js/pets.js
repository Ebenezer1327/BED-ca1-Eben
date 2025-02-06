document.addEventListener("DOMContentLoaded", function() {
    let challengerPetId = null;
    let opponentPetId = null;

    const battleButton = document.getElementById('battleButton');
    battleButton.disabled = true; // Start as disabled

    // Get the logged-in user's ID from localStorage
    const loggedInUserId = localStorage.getItem('user_id'); 
    
    if (!loggedInUserId) {
        console.error('No user logged in!');
        return;
    }
    
    const userId = Number(loggedInUserId); // Convert user_id to a number for comparison
    
    // Display Pokémon pets for the logged-in user
    axios.get(`http://localhost:3000/pets/trainer/${userId}`)
        .then(response => {
            const pokemonList = response.data;
            const pokemonListContainer = document.getElementById('pokemonList');
    
            if (pokemonList.length === 0) {
                pokemonListContainer.innerHTML = '<p>No Pokémon found for this user.</p>';
                return;
            }
    
            pokemonListContainer.innerHTML = '';
    
            pokemonList.forEach(pokemon => {
                const pokemonCard = document.createElement('div');
                pokemonCard.classList.add('pokemon-card');
                const level = Math.floor((parseInt(pokemon.total_training_skillpoints) + 50) / 50);
                pokemonCard.innerHTML = `
                    <h4>${pokemon.pet_name}</h4>
                    <p>pet_id: ${pokemon.pet_id}</p>
                    <p>${pokemon.species}</p>
                    <p>Level: ${level}</p>
                    <button class="btn btn-primary challenger-btn" data-pet-id="${pokemon.pet_id}" data-pet-name="${pokemon.pet_name}">Select for Battle</button>
                `;
                pokemonListContainer.appendChild(pokemonCard);
            });
    
           // Attach event listener for challenger selection
    document.querySelectorAll('.challenger-btn').forEach(button => {
        button.addEventListener('click', function () {
            challengerPetId = button.getAttribute('data-pet-id');
            console.log(`Challenger selected: ${challengerPetId}`);
            updateBattleButton();
        });
    });
})
.catch(error => {
    console.error('Error fetching Pokémon:', error);
});

document.getElementById('searchInput').addEventListener('input', function(event) {
const searchTerm = event.target.value.toLowerCase();
const pokemonCards = document.querySelectorAll('.pokemon-card');

pokemonCards.forEach(card => {
const petName = card.querySelector('h4').textContent.toLowerCase();
if (petName.includes(searchTerm)) {
    card.style.display = '';
} else {
    card.style.display = 'none';
}
});
});


    // Display battle-ready Pokémon from other trainers
    function displayBattleArea() {
        axios.get('http://localhost:3000/users')
            .then(userResponse => {
                const userIds = userResponse.data.map(user => user.user_id);
                
                const battleAreaContainer = document.getElementById('battleArea');
                battleAreaContainer.innerHTML = ''; // Clear previous content
    
                let allPets = [];
    
                const petRequests = userIds
                .filter(trainerId => trainerId != loggedInUserId) // Exclude logged-in user
                .map(trainerId => 
                    axios.get(`http://localhost:3000/pets/trainer/${trainerId}`)
                        .then(petResponse => {
                            const trainerPets = petResponse.data.filter(pet => pet.trainer_id !== loggedInUserId);
                            allPets = allPets.concat(trainerPets);
                        })
                        .catch(error => {
                            console.error(`Error fetching pets for trainer ${trainerId}:`, error);
                        })
                );
    
                Promise.all(petRequests).then(() => {
                    if (allPets.length === 0) {
                        battleAreaContainer.innerHTML = '<p>No available pets for battle.</p>';
                        return;
                    }
    
                    allPets.forEach(pet => {
                        const petCard = document.createElement('div');
                        petCard.classList.add('pokemon-card');
                        const level = Math.floor((parseInt(pet.total_training_skillpoints) + 50) / 50);
                        petCard.innerHTML = `
                            <h4>${pet.pet_name}</h4>
                            <p>pet_id: ${pet.pet_id}</p>
                            <p>${pet.species}</p>
                            <p>Level: ${level}</p>
                            <button class="btn btn-primary opponent-btn" data-pet-id="${pet.pet_id}" data-pet-name="${pet.pet_name}">Select for Battle</button>
                        `;
                        battleAreaContainer.appendChild(petCard);
                    });

                     // Attach event listener for opponent selection
            document.querySelectorAll('.opponent-btn').forEach(button => {
                button.addEventListener('click', function () {
                    opponentPetId = button.getAttribute('data-pet-id');
                    console.log(`Opponent selected: ${opponentPetId}`);
                    updateBattleButton();
                });
            });
        });
    })
    .catch(error => {
        console.error('Error fetching user IDs:', error);
    });
}

    // Start battle when both challenger and opponent are selected
    function startBattle() {
        if (!challengerPetId || !opponentPetId) {
            console.log("Both a challenger and an opponent need to be selected.");
            return;
        }

        // Enable battle button and start battle
        const battleButton = document.getElementById('battleButton');
        battleButton.disabled = false;

        // Remove previous event listener
        battleButton.removeEventListener('click', handleBattleClick);
        
        // Add event listener only once
        battleButton.addEventListener('click', handleBattleClick);
    }

    // Handle the battle click
    function handleBattleClick() {
        axios.post('http://localhost:3000/pets/battles', {
            challenger_pet_id: challengerPetId,
            opponent_pet_id: opponentPetId
        })
        .then(response => {
            const battleResult = response.data;
            const battleLog = document.getElementById('battleLog');
            
            battleLog.innerHTML = `<p>Battle Result:</p>
                                   <p>pet_id: ${battleResult.winner_pet_id} won the battle!</p>`;
            // Reset battle state after battle is over
            challengerPetId = null;
            opponentPetId = null;
            document.getElementById('battleButton').disabled = true;
        })
        .catch(error => {
            console.error('Error starting battle:', error);
        });
    }

      // Add event listener for the Create button to add a new pet
      document.getElementById('createButton').addEventListener('click', function() {
        const petName = prompt("Enter your pet's name:");
        const species = prompt("Enter the species of your pet:");

        if (petName && species) {
            const newPetData = {
                trainer_id: userId,
                pet_name: petName,
                species: species,
                base_skillpoints: 50
            };

            axios.post('http://localhost:3000/pets', newPetData)
                .then(response => {
                    console.log('New pet added:', response.data);
                    alert(`Your pet "${petName}" has been created successfully!`);
                    window.location.reload(); // Reload the page to show the new pet
                })
                .catch(error => {
                    console.error('Error creating new pet:', error);
                });
        } else {
            alert("Please provide both pet name and species.");
        }
    });


   // Enable battle button only when both are selected
function updateBattleButton() {
if (challengerPetId && opponentPetId) {
    battleButton.disabled = false;
} else {
    battleButton.disabled = true;
}
}

// Start battle
battleButton.addEventListener('click', function () {
if (!challengerPetId || !opponentPetId) {
    console.log("Both a challenger and an opponent need to be selected.");
    return;
}

axios.post('http://localhost:3000/pets/battles', {
    challenger_pet_id: challengerPetId,
    opponent_pet_id: opponentPetId
})
.then(response => {
    const battleResult = response.data;
    const battleLog = document.getElementById('battleLog');

    battleLog.innerHTML = `<p>Battle Result:</p>
                           <p>pet_id: ${battleResult.winner_pet_id} won the battle!</p>`;
    // Reset battle state after battle is over
    challengerPetId = null;
    opponentPetId = null;
    battleButton.disabled = true;
})
.catch(error => {
    console.error('Error starting battle:', error);
});
});

// Fetch and display battle area pets when the page loads
displayBattleArea();
});
