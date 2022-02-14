let username = {name: ''};

function sendUsername() {
    username.name = document.querySelector('.login-screen input').value;
    
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', username);
    promise.then(() => {
        document.querySelector('.login-screen').classList.add('hidden');
        getMessages();
        getParticipants();

        stayOnline();
        setInterval(getMessages, 3000);
        setInterval(getParticipants, 10000);
    });
    promise.catch((error) => {
        if (error.response.status === 400) {
            alert('Esse nome não está disponível');
        } else {
            alert('Erro desconhecido');
            window.location.reload();
        }
    });
}

function sendUsernameEnter (event) {
    if (event.keyCode === 13) {
        sendUsername();
    }
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
                <li class="message status" data-identifier="message">
                    <p><span>(${message.time})</span> <strong>${message.from}</strong> ${message.text}</p>
                </li>
            `;

            document.querySelector('.message:last-child').scrollIntoView();
        } else if (message.type === 'message') {
            chat.innerHTML += `
                <li class="message" data-identifier="message">
                    <p><span>(${message.time})</span> <strong>${message.from}</strong> para <strong>${message.to}</strong> ${message.text}</p>
                </li>
            `;

            document.querySelector('.message:last-child').scrollIntoView();
        } else if (message.type === 'private_message' && (message.to === username.name || message.from === username.name)) {
            chat.innerHTML += `
                <li class="message private" data-identifier="message">
                    <p><span>(${message.time})</span> <strong>${message.from}</strong> reservadamente para <strong>${message.to}</strong> ${message.text}</p>
                </li>
            `;

            document.querySelector('.message:last-child').scrollIntoView();
        }
    }
}

function sendMessage() {
    const messageText = document.querySelector('footer input').value;
    const messageTo = document.querySelector('footer span:first-of-type').innerHTML;
    const config = document.querySelector('footer span:last-child').innerHTML;
    let messageType = null;
    if (config === 'publicamente') {
        messageType = 'message';
    } else if (config === 'reservadamente') {
        messageType = 'private_message';
    }

    const message = {
        from: username.name,
        to: messageTo,
        text: messageText,
        type: messageType
    };

    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages', message);
    promise.then((response) => {
        console.log(response.data);
        getMessages();
        document.querySelector('footer input').value = '';
    });
    promise.catch((error) => {
        console.log(error.response);
        window.location.reload();
    });
}

function sendMessageEnter(event) {
    if (event.keyCode === 13) {
        sendMessage();
    }
}

function getParticipants() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    promise.then((response) => {
        displayParticipants(response.data);
    });
    promise.catch((error) => {
        console.log(error.response);
    });
}

function displayParticipants(participants) {
    const userList = document.querySelector('.contacts');
    userList.innerHTML = `
        <li onclick="selectContact(this)">
            <div>
                <ion-icon name="people"></ion-icon>
                <p>Todos</p>
            </div>
            <img src="images/check.svg" alt="checkmark">
        </li>
    `;

    for (let i=0; i<participants.length; i++) {
        userList.innerHTML += `
        <li onclick="selectContact(this)">
            <div>
                <ion-icon name="person-circle"></ion-icon>
                <p>${participants[i].name}</p>
            </div>
            <img src="images/check.svg" alt="checkmark" class="hidden">
        </li>
    `;
    }
}

function toggleMenu() {
    const sideMenu = document.querySelector('aside');
    const background = document.querySelector('.background');

    sideMenu.classList.toggle('hidden');
    background.classList.toggle('hidden')
}

function selectContact(user) {
    const checkmarked = document.querySelector('.contacts img:not(.hidden)');
    if (!!checkmarked) checkmarked.classList.add('hidden');

    user.querySelector('img').classList.remove('hidden');
    const name = user.querySelector('p').innerHTML;
    document.querySelector('footer span:first-child').innerHTML = name;
}

function selectVisibility(item) {
    const checkmarked = document.querySelector('.visibility img:not(.hidden)');
    if (!!checkmarked) checkmarked.classList.add('hidden');

    item.querySelector('img').classList.remove('hidden');
    const config = item.querySelector('p').innerHTML;

    if (config === 'Público') {
        document.querySelector('footer span:last-child').innerHTML = 'publicamente';
    } else if (config === 'Reservadamente') {
        document.querySelector('footer span:last-child').innerHTML = 'reservadamente';
    }
}