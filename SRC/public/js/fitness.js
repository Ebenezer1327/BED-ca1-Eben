// Get username from localStorage
const username = localStorage.getItem('username');
if (username) {
    document.getElementById('username-display').textContent = `Hello, ${username}`;
}

axios.get('http://localhost:3000/challenges')
    .then(response => {
        const challenges = response.data;
        const challengesList = document.getElementById('challengesList');

        challenges.forEach(challenge => {
            const challengeCard = document.createElement('li');
            challengeCard.classList.add('challenge-card');

            const challengeInfo = document.createElement('div');
            challengeInfo.classList.add('challenge-info');
            
            const challengeTitle = document.createElement('h2');
            challengeTitle.textContent = challenge.challenge;
            challengeInfo.appendChild(challengeTitle);
            
            const challengePoints = document.createElement('p');
            challengePoints.textContent = `Skillpoints: ${challenge.skillpoints}`;
            challengeInfo.appendChild(challengePoints);
            
            const challengeActions = document.createElement('div');
            challengeActions.classList.add('challenge-actions');

            const passButton = document.createElement('button');
            passButton.textContent = 'Pass';
            passButton.classList.add('complete-btn');
            passButton.onclick = () => handleChallengeResult(challenge.challenge_id, 'pass');
            
            const failButton = document.createElement('button');
            failButton.textContent = 'Fail';
            failButton.classList.add('fail-btn');
            failButton.onclick = () => handleChallengeResult(challenge.challenge_id, 'fail');
            
            challengeActions.appendChild(passButton);
            challengeActions.appendChild(failButton);
            
            challengeCard.appendChild(challengeInfo);
            challengeCard.appendChild(challengeActions);
            
            challengesList.appendChild(challengeCard);
        });
    })
    .catch(error => {
        console.error('Error fetching challenges:', error.response ? error.response.data : error.message);
    });

    function handleChallengeResult(challengeId, result) {
console.log("Challenge ID received:", challengeId); // Debugging log

if (!challengeId) {
console.error("Invalid challenge ID:", challengeId);
alert("Challenge ID is missing. Please refresh the page and try again.");
return;
}

// Retrieve user_id from localStorage
const userId = localStorage.getItem('user_id');
if (!userId) {
console.error("User ID not found in localStorage");
alert("User ID is missing. Please log in again.");
return;
}

// Fetch the user's current skill points
axios.get(`http://localhost:3000/users/${userId}`)
.then(userResponse => {
// Find the user from the array
const user = userResponse.data.find(u => u.user_id == userId);

if (user) {
    const currentSkillPoints = user.skillpoints || 0;
    console.log('Current Skill Points:', currentSkillPoints);

    // Now fetch challenge data
    axios.get(`http://localhost:3000/challenges`)
        .then(challengeResponse => {
            // Find the challenge by its ID
            const challenge = challengeResponse.data.find(challenge => challenge.challenge_id === challengeId);
            const challengeSkillPoints = challenge ? challenge.skillpoints : 0;

            console.log('Challenge Skill Points:', challengeSkillPoints);  // Debugging log

            // Calculate new skill points
            let newSkillPoints = currentSkillPoints;
            if (result === 'pass') {
                newSkillPoints += challengeSkillPoints;
            } else {
                newSkillPoints += 5; // Award 5 points for failure
            }

            console.log('New Skill Points:', newSkillPoints);  // Debugging log

            // Update user skill points in the database
            axios.put(`http://localhost:3000/users/${userId}`, {
                username: user.username,
                skillpoints: newSkillPoints
            })
            .then(updateResponse => {
                console.log("Skill points updated:", updateResponse.data);
                alert(`You now have ${newSkillPoints} skill points!`);
                
                // Update skill points on the page
                document.getElementById('skillpoints').textContent = `Your skill points: ${newSkillPoints}`;


                const completionStatus = result === 'pass' ? 1 : 0;  // 1 for pass, 0 for fail
                const date = new Date().toISOString().slice(0, 19).replace("T", " ");

                axios.post(`http://localhost:3000/challenges/${challengeId}`, {
                user_id: userId,
                completed: completionStatus,
                creation_date: new Date().toISOString().slice(0, 19).replace("T", " "),  // Adjusted datetime format
                notes: completionStatus === 0 ? "You'll get 5 points for trying!" : ""
                 })

                .then(logResponse => {
                    console.log("Challenge completion logged:", logResponse.data);
                })
                .catch(logError => {
                    console.error("Error logging challenge completion:", logError.response ? logError.response.data : logError.message);
                    alert("Failed to log challenge completion. Please try again.");
                });

            })
            .catch(updateError => {
                console.error("Error updating skill points:", updateError.response ? updateError.response.data : updateError.message);
                alert("Failed to update skill points. Please try again.");
            });
        })
        .catch(challengeError => {
            console.error("Error fetching challenge data:", challengeError.response ? challengeError.response.data : challengeError.message);
            alert("Failed to get challenge details. Please try again.");
        });
} else {
    console.error("User not found");
    alert("User not found. Please log in again.");
}
})
.catch(userError => {
console.error("Error fetching user data:", userError.response ? userError.response.data : userError.message);
alert("Failed to get user data. Please try again.");
});
}
