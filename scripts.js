let username = {name: ''};

function sendUsername() {
    username.name = prompt('Digite o nome do usuário:');
    
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', username);
    promise.then(() => {
        getMessages();
        stayOnline();
        setInterval(getMessages, 3000);
    });
    promise.catch((error) => {
        if (error.response.status === 400) {
            alert('Esse nome não está disponível');
            sendUsername();
        } else {
            alert('Erro desconhecido');
            window.location.reload();
        }
    })
}

function stayOnline() {
    setInterval(() => {
        const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status', username);
        promise.then((response) => {
            console.log(response.data);
        });
        promise.catch((error) => {
            console.log(error.response.status);
        });
    }, 5000);
}

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

function sendMessage() {
    const messageText = document.querySelector('footer input').value;
    const message = {
        from: username.name,
        to: "Todos",
        text: messageText,
        type: "message"
    };

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', message);
    promise.then((response) => {
        console.log(response.data);
        getMessages();
    });
    promise.catch((error) => {
        console.log(error.response);
        window.location.reload();
    });
}

sendUsername();