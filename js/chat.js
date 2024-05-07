const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

function sendMessage() {
    const message = userInput.value;
    displayMessage(message, 'user');
    userInput.value = '';

    // Send message to AI and get response
    getAIResponse(message);
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    chatMessages.appendChild(messageElement);
}

async function getAIResponse(message) {
    try {
        console.log(`Sending message to Worker: ${message}`);
        const response = await fetch('https://ai-worker.thiagozevedo3.workers.dev/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: message
                    }
                ]
            })
        });
        console.log(`Message sent.`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log(await response);

        const responseData = await response.json();
        const aiResponse = responseData[0].response.response;
        console.log(responseData)
        console.log(aiResponse)

        displayMessage(aiResponse, 'ai');
    } catch (error) {
        console.error('Error fetching AI response:', error);
        displayMessage('Oops! Something went wrong. Please try again later.', 'ai');
    }
}

// Event listener to call sendMessage() when Enter key is pressed
userInput.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) { // Enter key
        event.preventDefault();
        sendMessage();
    }
});