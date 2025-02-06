const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});


function registerUser() {
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const passwordRegex = /^(?=.*[!@#$%^&*]).{8,}$/;

    if (!passwordRegex.test(password)) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = "Password must be at least 8 characters long and include at least one special character (!@#$%^&*).";
        messageDiv.style.color = 'red';
        return;  // Stop the function if the password does not meet the requirement
    }

    axios.post("http://localhost:3000/users/register", { username, email, password })
	.then(function (response) {
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = response.data.message;
                messageDiv.style.color = 'green'
            })
            .catch(function (error) {
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = error.response.data.message;
                messageDiv.style.color = 'red'
            })
        }

        function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    axios.post("http://localhost:3000/users/login", { email, password })
        .then(function (response) {
            const messageDiv = document.getElementById('LoginMessage');
            messageDiv.textContent = response.data.message;
            messageDiv.style.color = 'green';

            // Store user_id and username in localStorage
            localStorage.setItem('user_id', response.data.user_id);
            localStorage.setItem('username', response.data.username);

            // Generate JWT token
            return axios.post("http://localhost:3000/jwt/generate", { user_id: response.data.user_id });
        })
        .then(function (tokenResponse) {
            // Store JWT token in localStorage
            localStorage.setItem('jwt_token', tokenResponse.data.token);

            // Redirect to gameHome.html
            window.location.href = "gameHome.html";
        })
        .catch(function (error) {
            const messageDiv = document.getElementById('LoginMessage');
            messageDiv.textContent = error.response?.data?.message || "An error occurred";
            messageDiv.style.color = 'red';
        });
}