const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const buttonIcon = document.getElementById('button-icon');
const info = document.querySelector('.info');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();

    if (message === '') {
        return;
    }

    appendMessage('user', message);
    userInput.value = '';

    if (message.toLowerCase() === 'developer') {
        appendTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            appendMessage('bot', 'This Source Coded By Ashwin Gupta \nYouTube : Ashwin Gupta');
            resetButtonIcon();
        }, 2000);
        return;
    }

    const url = 'https://chatgpt-42.p.rapidapi.com/gpt4';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'c4caa1f78dmsh01f3473c3a7f0c2p132cddjsn82aac5d4fca4',
            'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            web_access: false
        })
    };

    try {
        appendTypingIndicator();

        const response = await fetch(url, options);
        const result = await response.json();
        
        // Log the entire response for debugging
        console.log('API Response:', result);

        // Check if the response contains the expected data
        if (result && result.status) {
            removeTypingIndicator();
            appendMessage('bot', result.result);
        } else if (result && result.error) {
            // Handle error messages returned by the API
            removeTypingIndicator();
            appendMessage('bot', `Error from API: ${result.error.message}`);
        } else {
            // Handle any other unexpected formats
            removeTypingIndicator();
            appendMessage('bot', 'An error occurred: Unexpected API response format.');
        }
    } catch (error) {
        removeTypingIndicator();
        appendMessage('bot', 'An error occurred: ' + error.message);
        console.error('Error:', error);
    }
}

function appendMessage(sender, message) {
    info.style.display = "none";

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('div');

    chatElement.classList.add("chat-box");
    iconElement.classList.add("icon");
    messageElement.classList.add("sender");
    messageElement.innerText = message;

    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);

    chatLog.scrollTop = chatLog.scrollHeight;  // Fixes the scroll to bottom issue
}

function appendTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.classList.add('chat-box', 'bot');
    typingElement.innerText = 'Typing...';
    typingElement.setAttribute('id', 'typing-indicator');
    chatLog.appendChild(typingElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function removeTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        chatLog.removeChild(typingElement);
    }
}

function resetButtonIcon() {
    buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
}
