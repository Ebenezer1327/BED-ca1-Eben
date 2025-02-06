
        document.addEventListener("DOMContentLoaded", function() {
            let userSkillPoints = 0; // Declare this here to avoid scope issues
            let challengerPetId = null;

            // Get the logged-in user's ID from localStorage
            const username = localStorage.getItem('username');
            const loggedInUserId = localStorage.getItem('user_id');
            console.log("Logged in user ID:", loggedInUserId);
 
            if (!loggedInUserId) {
                console.error('No user logged in!');
                return;
            }
            
            const userId = Number(loggedInUserId); // Convert user_id to a number for comparison

            // Fetch and display the user's total skill points
            axios.get(`http://localhost:3000/users/${userId}`)
                .then(response => {
                    console.log('User Response:', response.data); // Log full response to check data structure
                    const user = response.data[0];
                    userSkillPoints = user?.skillpoints || 0; // Assign to the userSkillPoints variable
                    document.getElementById('skillPointsContainer').textContent = `Skill Points: ${userSkillPoints}`;
                })
                .catch(error => {
                    console.error("Error fetching user skill points:", error);
                    document.getElementById('skillPointsContainer').textContent = "Skill Points: Error";
                });

            // Fetch and display Pokémon pets for the logged-in user
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
                            <button class="btn btn-primary levelup-btn" data-pet-id="${pokemon.pet_id}" data-pet-name="${pokemon.pet_name}">Level Up</button>
                        `;
                        pokemonListContainer.appendChild(pokemonCard);
                    });
            
                    // Attach event listener for level up
                        const levelBtns = document.querySelectorAll('.levelup-btn');
                        levelBtns.forEach(button => {
                        button.addEventListener('click', function() {
                        const petId = button.getAttribute('data-pet-id');
                        const petName = button.getAttribute('data-pet-name');

                        // Check if there are enough skill points (at least 50)
                        if (userSkillPoints < 50) {
                            alert("You do not have enough skill points! You need at least 50.");
                            return;
                        }

                        // Send POST request to train the pet with the user's skill points
                        axios.post(`http://localhost:3000/pets/${petId}/train`, {
                            training_skillpoints: 50 // Send exactly 50 skill points as the training value
                        })
                        .then(response => {
                            console.log(`${petName} leveled up!`, response);
                            // Update skill points after training
                            userSkillPoints -= 50; // Deduct exactly 50 skill points after leveling up
                            console.log("This is the userSkillPoint:" + userSkillPoints);

                            // Update the skill points on the server
                            axios.put(`http://localhost:3000/users/${userId}`, { 
                                username: username,
                                skillpoints: userSkillPoints // Update with the new skill points
                            })
                            .then(updateResponse => {
                                console.log('User skill points updated:', updateResponse);
                                document.getElementById('skillPointsContainer').textContent = `Skill Points: ${userSkillPoints}`;

                                // Show the level-up success message
                                const levelUpMessage = document.getElementById('levelUpMessage');
                                levelUpMessage.style.display = 'block';

                                // Hide the message after 3 seconds
                                setTimeout(() => {
                                    levelUpMessage.style.display = 'none';
                                }, 1000);

                                // Reload the page after 3 seconds
                                setTimeout(() => {
                                    window.location.reload();
                                }, 2000);
                            })
                            .catch(error => {
                                console.error("Error updating user skill points:", error);
                            });

                        })
                        .catch(error => {
                            console.error(`Error leveling up ${petName}:`, error);
                        });
                            });
                                });
                                });
                            });


            
