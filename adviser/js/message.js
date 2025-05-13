document.addEventListener('DOMContentLoaded', function () {
    const companyItems = document.querySelectorAll('.company-item');
    const chatMessages = document.getElementById('chatMessages');
    const chatCompanyName = document.getElementById('chatcompanyName');
    const chatCompanyImage = document.getElementById('chatcompanyImage');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    let selectedCompanyId = null;
    let pollingInterval = null;

    companyItems.forEach(item => {
        item.addEventListener('click', function () {
            selectedCompanyId = this.getAttribute('data-company-id');
            const companyName = this.querySelector('.company-name').textContent;
            const companyImage = this.querySelector('img').src;

            chatCompanyName.textContent = companyName;
            chatCompanyImage.src = companyImage;

            // Enable the input and button
            messageInput.disabled = false;
            sendMessageBtn.disabled = false;

            // Clear previous messages
            chatMessages.innerHTML = '';

            // Hide the unread notification for this company
            const unreadNotification = this.querySelector('.unread-count');
            if (unreadNotification) {
                unreadNotification.style.display = 'none';
            }

            // Fetch the conversation with the clicked company
            fetchConversation(selectedCompanyId);

            // Start polling for new messages
            startMessagePolling();
        });
    });

    // Function to send a message
    sendMessageBtn.addEventListener('click', function () {
        const message = messageInput.value.trim();

        if (message === '' || !selectedCompanyId) {
            return; // Do nothing if the message is empty or no company is selected
        }

        sendMessage(selectedCompanyId, message);
    });

    function fetchConversation(companyId) {
        fetch('fetch_messages.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `company_id=${companyId}`
        })
            .then(response => response.json())
            .then(messages => {
                if (messages.error) {
                    console.error(messages.error);
                    return;
                }

                // Display the fetched messages
                chatMessages.innerHTML = ''; // Clear existing messages to avoid duplication
                messages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message');

                    // Differentiate between sent and received messages
                    if (msg.sender_type === 'adviser') {
                        messageDiv.classList.add('sent');
                    } else {
                        messageDiv.classList.add('received');
                    }

                    // Message content and timestamp
                    messageDiv.innerHTML = `
                        ${msg.message}
                        <span class="timestamp">${new Date(msg.timestamp).toLocaleString()}</span>
                    `;

                    chatMessages.appendChild(messageDiv);
                });

                // Scroll to the bottom of the chat
                chatMessages.scrollTop = chatMessages.scrollHeight;
            })
            .catch(error => console.error('Error fetching messages:', error));
    }

    function sendMessage(companyId, message) {
        fetch('send_message.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `company_id=${companyId}&message=${encodeURIComponent(message)}`
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Clear the input field
                    messageInput.value = '';

                    // Display the sent message in the chat box
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message', 'sent');
                    messageDiv.innerHTML = `
                        ${message}
                        <span class="timestamp">${new Date().toLocaleString()}</span>
                    `;

                    chatMessages.appendChild(messageDiv);

                    // Scroll to the bottom of the chat
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } else {
                    console.error('Error sending message:', result.error);
                }
            })
            .catch(error => console.error('Error sending message:', error));
    }

    // Function to poll for new messages
    function startMessagePolling() {
        // Clear any existing polling interval to avoid multiple intervals running
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        pollingInterval = setInterval(() => {
            if (!selectedCompanyId) return;

            fetch('fetch_messages.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `company_id=${selectedCompanyId}`
            })
                .then(response => response.json())
                .then(messages => {
                    if (messages.error) {
                        console.error(messages.error);
                        return;
                    }

                    // Clear and update the chat box with new messages
                    chatMessages.innerHTML = '';
                    messages.forEach(msg => {
                        const messageDiv = document.createElement('div');
                        messageDiv.classList.add('message');
                        if (msg.sender_type === 'adviser') {
                            messageDiv.classList.add('sent');
                        } else {
                            messageDiv.classList.add('received');
                        }

                        messageDiv.innerHTML = `
                            ${msg.message}
                            <span class="timestamp">${new Date(msg.timestamp).toLocaleString()}</span>
                        `;

                        chatMessages.appendChild(messageDiv);
                    });

                    // Scroll to the bottom of the chat
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                })
                .catch(error => console.error('Error fetching new messages:', error));
        }, 3000); // Poll every 3 seconds
    }
});
