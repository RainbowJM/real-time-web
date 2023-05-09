const socket = io();
const messages = document.querySelector('section#chat ul');
const input = document.querySelector('#message-input');
const inputName = document.querySelector('#name-input');
const nameTitle = document.querySelector('p#name');
const typingElement = document.querySelector('#typing');
const submitMessage = document.querySelector('#message-button');
const inputMessage = document.querySelector('#name-button');
const submitName = document.querySelector('#name-button');
const connectedUser = document.querySelector('section#players p#connected');
const playersList = document.querySelector('section#players ul');
const chatScreen = document.querySelector('main section');
const word = document.querySelector('section#question-answers-options p#question');
let names = document.querySelector('section#players ul');
let messageLast = '';
let currentUser;
let correct = false;
let currentWordEng;

submitMessage.addEventListener('click', event => {
    event.preventDefault()

    const hour = new Date().toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (input.value) {
        socket.emit('message', {
            message: input.value,
            name: nameTitle.textContent,
            time: hour
        })

        add(input.value, nameTitle.textContent, socket.id, hour)

        if (input.value.charAt(0).toUpperCase() + input.value.slice(1) == currentWordEng) {
            correct = true;
            socket.emit('answer', correct)
        }

        input.value = ''
    }
});

input.addEventListener('input', event => {
    event.preventDefault();
    socket.emit('typing', {
        name: nameTitle.textContent,
        typing: true
    })
    setTimeout(() => {
        socket.emit("typing", {
            name: nameTitle.textContent,
            typing: false
        })
    }, 3000)
});

socket.emit('user', nameTitle.textContent);

socket.on('message', message => {
    if (message.id != socket.id) {
        add(message.message, message.name, message.id, message.time)
    }
});

socket.on("typing", (typing) => {
    let names = []

    typing.forEach((client) => {
        if (client[1] != socket.id) {
            names.push(client[0])
        }
    })

    if (names.length == 0) {
        // Empty indicator
        typingElement.innerHTML = ""
    } else if (names.length == 1) {
        // Fill the typing indicator with text
        typingElement.innerHTML = `${names[0]} is typing...`
    } else {
        // Fill the typing indicator with text
        typingElement.innerHTML = `${names.slice(0, -1).join(", ")} and ${names.slice(-1)} are typing...`
    }
})

socket.on("users", (users) => {
    // Update the amount of clients.
    connectedUser.innerHTML = `<span></span>${users.length} online`

    // Clear the list.
    playersList.innerHTML = ""

    users.forEach((user) => {
        // Add the client to the list.
        playersList.appendChild(Object.assign(document.createElement("li"), {
            innerHTML: `${user[0]} <span id="score">${user[2]}</span>`
        }))
    })
})

socket.on('history', (history) => {
    history.forEach((message) => {
        add(message.message, message.name, message.id, message.time)
    })
})

socket.on('data', (currentWord) => {
    currentWordEng = currentWord.eng;
})

socket.on('connect', () => {
    checkSocketConnection();
    setInterval(checkSocketConnection, 500);
});

function add(message, name, id, time) {
    messages.appendChild(Object.assign(document.createElement('li'), {
        innerHTML: `<section>
        <span class="name">${name}</span> 
        <span class="time">${time}</span> 
        <span class="message">${message}</span>
        </section>`
    }));
    messages.scrollTop = messages.scrollHeight;
    last = id;
}

function checkSocketConnection() {
    if (socket.connected) {
        console.log('Socket is connected');
        chatScreen.classList.remove('socket-disconnected');
    } else {
        console.log('Socket is disconnected');
        chatScreen.classList.add('socket-disconnected');
        setTimeout(() => {
            if (!socket.connected) {
                const error = document.querySelector('#error');
                error.textContent = 'You are disconnected';
                error.classList.add('show');
            }
        }, 5000);
    }
}