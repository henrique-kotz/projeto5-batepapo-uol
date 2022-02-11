let username = '';

function getMessages() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promise.then((response) => {
        displayChat(response.data);
    });
    promise.catch((error) => {
        console.log(error.response);
    });
}

function displayChat(messages) {
    const chat = document.querySelector('main ul');
    chat.innerHTML = '';

    for (let i=0; i<messages.length; i++) {
        let message = messages[i];

        if (message.type === 'status') {
            chat.innerHTML += `
                <li class="message status">
                    <p><span>(${message.time})</span> <strong>${message.from}</strong> ${message.text}</p>
                </li>
            `;

            document.querySelector('.message:last-child').scrollIntoView();
        } else if (message.type === 'message') {
            chat.innerHTML += `
                <li class="message">
                    <p><span>(${message.time})</span> <strong>${message.from}</strong> para <strong>${message.to}</strong> ${message.text}</p>
                </li>
            `;

            document.querySelector('.message:last-child').scrollIntoView();
        } else if (message.type === 'private_message' && message.to === username) {
            chat.innerHTML += `
                <li class="message private">
                    <p><span>(${message.time})</span> <strong>${message.from}</strong> reservadamente para <strong>${message.to}</strong> ${message.text}</p>
                </li>
            `;

            document.querySelector('.message:last-child').scrollIntoView();
        }
    }
}

getMessages();
setInterval(getMessages, 3000);