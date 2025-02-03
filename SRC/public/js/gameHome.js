
        window.onload = function() {
            const Username = localStorage.getItem('username');
            
            if (Username) {
                // Use user_id for whatever you need in gameHome.html
                console.log('Welcome:', Username);
                document.getElementById('user-id-display').textContent = `Welcome: ${Username}`;
            } else {
                console.log('No user logged in');
                window.location.href = "login.html"; // Redirect to login if no user_id
            }
        };

        function signOut() {
            localStorage.clear(); // Clears all stored data
        }
        
