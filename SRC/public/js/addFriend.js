 // Fetch logged-in user ID
 const loggedInUserId = Number(localStorage.getItem('user_id'));
 console.log("Logged in user ID:", loggedInUserId);
 
 // Function to fetch and display users
 function fetchAndDisplayUsers() {
     axios.get('http://localhost:3000/users')
         .then(response => {
             const users = response.data;
             const friendsList = document.getElementById('friendList');
 
             // Clear previous content before appending new ones
             friendsList.innerHTML = '';
 
             // Fetch the current user's friends
             axios.get(`http://localhost:3000/friendship/list/${loggedInUserId}`)
                 .then(friendResponse => {
                     const currentUserFriends = friendResponse.data.map(friend => friend.user_id);
                     console.log("Current User's Friends:", currentUserFriends); // Debugging
 
                     // Display users except the logged-in user
                     users.filter(user => user.user_id !== loggedInUserId).forEach(user => {
                         const friendCard = document.createElement('div');
                         friendCard.classList.add('friend-card');
 
                         friendCard.innerHTML = `
                             <h5>${user.username}</h5>
                             <p>ID: ${user.user_id}</p>
                         `;
 
                         // Check if they are mutual friends (both sides added)
                         axios.get(`http://localhost:3000/friendship/list/${user.user_id}`)
                             .then(otherUserFriendsResponse => {
                                 const otherUserFriends = otherUserFriendsResponse.data.map(friend => friend.friend_id);
                                 console.log(`Friends of ${user.username}:`, otherUserFriends); // Debugging
 
                                 // If they are mutually friends, don't show "Add Friend" button
                                 if (!currentUserFriends.includes(user.user_id) && !otherUserFriends.includes(loggedInUserId)) {
                                     const addButton = document.createElement('button');
                                     addButton.classList.add('AddFriendButton');
                                     addButton.innerText = 'Add Friend';
 
                                     addButton.addEventListener('click', () => {
                                         axios.post('http://localhost:3000/friendship/add', {
                                             user_id: loggedInUserId,
                                             friend_id: user.user_id
                                         })
                                         .then(response => {
                                             alert(`${user.username} has been added as a friend!`);
                                             fetchAndDisplayUsers(); // Refresh UI
                                         })
                                         .catch(error => {
                                             console.error('Error adding friend:', error);
                                             alert('Error adding friend. Please try again.');
                                         });
                                     });
 
                                     friendCard.appendChild(addButton);
                                 }
 
                                 // Append the card to the list
                                 friendsList.appendChild(friendCard);
                             })
                             .catch(error => console.error('Error fetching other user friends:', error));
                     });
                 })
                 .catch(error => console.error('Error fetching friends:', error));
         })
         .catch(error => console.error('Error fetching users:', error));
 }
 
 // Run the function on page load
 fetchAndDisplayUsers();
 