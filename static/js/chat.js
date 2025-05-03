// Handle form submission for chat
document.getElementById('chat-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const question = this.user_question.value;

    // Hide the cards once the chat starts
    document.getElementById('card-container').style.display = 'none';

    // Display the chat history container
    const chatHistory = document.getElementById('chat-history');
    chatHistory.style.display = 'block';

    // Add user question to the chat history
    const userMessage = document.createElement('div');
    userMessage.classList.add('chat-message', 'user-message');
    userMessage.innerHTML = `<strong>You:</strong> ${question}`; // Bold "You"
    chatHistory.appendChild(userMessage);

    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `user_question=${encodeURIComponent(question)}` // Fixed syntax here
    })
    .then(response => response.json())

    .then(data => {
        const formatResponseToHTML = (text) => {
            // Convert **bold** markdown to HTML
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
            // Convert bullet points to <ul><li>
            const lines = text.split('\n');
            let html = '';
            let inList = false;
    
            lines.forEach(line => {
                if (/^\s*[\*\-]\s+/.test(line)) {
                    if (!inList) {
                        html += '<ul>';
                        inList = true;
                    }
                    html += `<li>${line.replace(/^\s*[\*\-]\s+/, '')}</li>`;
                } else {
                    if (inList) {
                        html += '</ul>';
                        inList = false;
                    }
                    if (line.trim() !== '') {
                        html += `<p>${line.trim()}</p>`;
                    }
                }
            });
    
            if (inList) {
                html += '</ul>';
            }
    
            return html;
        };
    
        const botMessage = document.createElement('div');
        botMessage.classList.add('chat-message', 'bot-message');
    
        const formattedResponse = formatResponseToHTML(data.response || 'No response from the server.');
        botMessage.innerHTML = `<strong>JusticeBot:</strong>${formattedResponse}`;
        
        chatHistory.appendChild(botMessage);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    });
    
    
    // Clear the input field after sending
    this.user_question.value = '';
});
