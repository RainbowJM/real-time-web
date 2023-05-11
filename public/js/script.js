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
const chatScreen = document.querySelector('main div#trivia');
const word = document.querySelector('section#question-answers-options p#question');
const descriptionElement = document.querySelector('section#question-answers-options p#description')
const networkError = document.querySelector('.error');
let names = document.querySelector('section#players ul');
let messageLast = '';
let currentUser;
let correct = false;
let currentWordEng;
let currentWordPap;
let description;

if (submitMessage) {
    submitMessage.addEventListener('click', event => {
        event.preventDefault()

        // Get the current time.
        const hour = new Date().toLocaleTimeString('nl-NL', {
            hour: '2-digit',
            minute: '2-digit'
        });

        if (input.value) {
            // Emit the message to all connected users.
            socket.emit('message', {
                message: input.value,
                name: nameTitle.textContent,
                time: hour
            })

            // Add the message to the chat.
            add(input.value, nameTitle.textContent, socket.id, hour, true)

            if (input.value.charAt(0).toUpperCase() + input.value.slice(1) === currentWordEng) {
                correct = true;
            }
            socket.emit('answer', correct)

            // Clear the input field.
            input.value = ''
        }
    });
}

if (input) {
    input.addEventListener('input', event => {
        event.preventDefault();
        // Emit the typing event.
        socket.emit('typing', {
            name: nameTitle.textContent,
            typing: true
        })
        setTimeout(() => {
            socket.emit('typing', {
                name: nameTitle.textContent,
                typing: false
            })
        }, 3000)
    });
}

if (nameTitle) {
    // Get the name of the user.
    socket.emit('user', nameTitle.textContent);
}

socket.on('message', message => {
    // Add the message to the chat.
    if (message.id != socket.id) {
        add(message.message, message.name, message.id, message.time)
    }
});

socket.on('typing', (typing) => {
    let names = []

    // Get the names of the users that are typing.
    typing.forEach((client) => {
        if (client[1] != socket.id) {
            // Add the name to the list.
            names.push(client[0])
        }
    })

    if (names.length == 0) {
        // Empty indicator
        typingElement.innerHTML = ""
    } else if (names.length == 1) {
        // Fill the typing indicator with text
        typingElement.innerHTML = `💬${names[0]} is typing...`
    } else {
        // Fill the typing indicator with text
        typingElement.innerHTML = `💬${names.slice(0, -1).join(", ")} and ${names.slice(-1)} are typing...`
    }
})

socket.on('users', (users) => {
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
    // Add the message to the chat.
    history.forEach((message) => {
        add(message.message, message.name, message.id, message.time)
    })
})

socket.on('data', (currentWord) => {
    currentWordEng = currentWord.eng;
    currentWordPap = currentWord.pap;
})

socket.on('connect', () => {
    checkSocketConnection();
    setInterval(checkSocketConnection, 500);
});

socket.on('next word', (currentWord) => {
    currentWordEng = currentWord.eng;
    currentWordPap = currentWord.pap;
    description = currentWord.descr;
    word.innerHTML = currentWordPap;
});

socket.on('description', (descr) => {
    if (description === undefined) {
        description = descr;
    }
    descriptionElement.innerHTML = currentWordPap + ': ' + description;
    setTimeout(() => {
        descriptionElement.innerHTML = '';
    }, 2000);

})

socket.on('wrong answer', () => {
    descriptionElement.innerHTML = '⚠️ Wrong answer!';
    setTimeout(() => {
        descriptionElement.innerHTML = '';
    }, 2000);
});

function add(message, name, id, time, self) {
    let styling = ""

    // Add styling to the message if you are the sender.
    if (self) {
        styling = "self"
    } else {
        if (last == id) {
            styling = "multiple"
        }
    }

    messages.appendChild(Object.assign(document.createElement('li'), {
        className: styling,
        innerHTML: `<section id='message'>
        <p class="name">${name}</p> 
        <span class="message">${message}</span>
        <span class="time">${time}</span> 
        </section>`
    }));
    // Scroll to the bottom of the chat.
    messages.scrollTop = messages.scrollHeight;
    last = id;
}

function checkSocketConnection() {
    if (socket.connected) {
        chatScreen.classList.remove('socket-disconnected');
    } else {
        const error = document.querySelector('#error');
        error.textContent = 'You are disconnected';
        error.classList.add('show');
        chatScreen.classList.add('socket-disconnected');


    }
}