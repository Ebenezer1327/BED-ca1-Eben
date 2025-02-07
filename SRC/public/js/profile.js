// Retrieve user_id from localStorage
const loggedInUserId = localStorage.getItem('user_id');
const userIdDisplay = document.getElementById('user-id-display');
const profilePhoto = document.getElementById('profilePhoto');
const photoUpload = document.getElementById('photoUpload');
const skillpointsValue = document.getElementById('skillpoints');
const usernameValue = document.getElementById('Name');

if (loggedInUserId) {
    userIdDisplay.textContent = `Logged in User ID: ${loggedInUserId}`;
} else {
    userIdDisplay.textContent = 'No user is logged in.';
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();z
        reader.onload = function(e) {
            const imageData = e.target.result;
            profilePhoto.src = imageData;
            localStorage.setItem(`profilePhoto_${loggedInUserId}`, imageData); // Store in localStorage
        }
        reader.readAsDataURL(file);
    }
}

// Load stored profile photo when page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedPhoto = localStorage.getItem(`profilePhoto_${loggedInUserId}`);
    if (savedPhoto) {
        profilePhoto.src = savedPhoto;
    }
});

photoUpload.addEventListener('change', handlePhotoUpload);



// Function to fetch and update skillpoints and username based on logged-in user
function fetchUserProfile() {
    if (loggedInUserId) {
        axios.get(`http://localhost:3000/users/${loggedInUserId}`)
            .then(response => {
                const user = response.data[0]; // Assuming the response contains an array
                const skillpoints = user.skillpoints || 0; // Default to 0 if skillpoints is missing
                const username = user.username || 'No username'; // Default to 'No username' if missing
                
                // Update the UI with the username and skillpoints
                usernameValue.textContent = username;
                skillpointsValue.textContent = skillpoints;
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }
}

// Fetch and display user profile when the page loads
fetchUserProfile();
