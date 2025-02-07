const userId = localStorage.getItem('user_id');

        axios.get(`http://localhost:3000/friendship/list/${userId}`)
            .then(friendshipResponse => {
                const friends = friendshipResponse.data;

                return axios.get('http://localhost:3000/users').then(usersResponse => {
                    const users = usersResponse.data;
                    const userListDiv = document.getElementById('userList');
                    userListDiv.innerHTML = '';

                    friends.forEach(friend => {z
                        const userDetails = users.find(user => user.user_id === friend.user_id);
                        if (userDetails) {
                            const userCard = document.createElement('div');
                            userCard.classList.add('col-md-4', 'mb-4');
                            userCard.innerHTML = `
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">${userDetails.username}</h5>
                                        <p class="card-text">${userDetails.email}</p>
                                        <button class="btn btn-primary message-btn" data-userid="${userDetails.user_id}" data-username="${userDetails.username}">Message</button>
                                    </div>
                                </div>
                            `;
                            userListDiv.appendChild(userCard);
                        }
                    });

                    // Event listener for message buttons
                    document.querySelectorAll('.message-btn').forEach(button => {
                        button.addEventListener('click', (event) => {
                            const recipientId = event.target.dataset.userid;
                            const recipientName = event.target.dataset.username;
                            document.getElementById('recipientName').innerText = `${recipientName}`;
                            document.getElementById('messageOverlay').style.display = 'flex';
                            document.getElementById('sendButton').dataset.userid = recipientId;

                            // Fetch conversation history
                            fetchConversationHistory(userId, recipientId);
                        });
                    });
                });
            });

        function fetchConversationHistory(userId, recipientId) {
            axios.get(`http://localhost:3000/message/conversation/${userId}?friend_id=${recipientId}`)
                .then(response => {
                    const messages = response.data;
                    const messageHistoryDiv = document.getElementById('messageHistory');
                    messageHistoryDiv.innerHTML = '';

                    console.log(`Current User ID: ${userId}`);

                messages.forEach(message => {
                    console.log(`Message from User ID: ${message.sender_id} intended for comparison with ${userId}`);
                    const isCurrentUser = Number(message.sender_id) == Number(userId);

                    console.log(`Is Current User: ${isCurrentUser}`);
                    
                    const messageBubble = document.createElement('div');
                    messageBubble.classList.add('message-bubble', isCurrentUser ? 'me' : 'them');
                    messageBubble.innerText = message.message_text;
                    messageHistoryDiv.appendChild(messageBubble);
                });

                })
                .catch(error => {
                    console.error('Error fetching conversation:', error);
                });
        }

        // Event listener to send a message
        document.getElementById('sendButton').addEventListener('click', async () => {
            const recipientId = document.getElementById('sendButton').dataset.userid;
            const messageText = document.getElementById('messageInput').value;

            if (messageText.trim() === '') {
                alert("Message cannot be empty!");
                return;
            }

            try {
                await axios.post('http://localhost:3000/message/send', {
                    sender_id: userId,
                    receiver_id: recipientId,
                    message_text: messageText
                });
                document.getElementById('messageInput').value = '';
                fetchConversationHistory(userId, recipientId);  // Refresh conversation history
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        document.getElementById('closeOverlay').addEventListener('click', () => {
            document.getElementById('messageOverlay').style.display = 'none';
        });