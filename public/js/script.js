const socket = io();
const messages = document.querySelector('section#chat ul');
const input = document.querySelector('#message-input');
const nameTitle = document.querySelector('p#name');
const typingElement = document.querySelector('#typing');
const submitMessage = document.querySelector('#message-button');
const submitName = document.querySelector('#name-button');
const connectedUser = document.querySelector('section#players p#connected');
const playersList = document.querySelector('section#players ul');
let names = document.querySelector('section#players ul');
let messageLast = '';
let currentUser;

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

socket.on("users", (clients) => {
    console.log(connectedUser, 'socket.on')
    // Update the amount of clients.
    connectedUser.innerHTML = `<span></span>${clients.length} online`

    // Clear the list.
    playersList.innerHTML = ""

    clients.forEach((client) => {
        // Add the client to the list.
        playersList.appendChild(Object.assign(document.createElement("li"), {
            innerHTML: `${client[0]} <span id="score">${client[2]}</span>`
        }))
    })
})

socket.on('history', (history) => {
    history.forEach((message) => {
        add(message.message, message.name, message.id, message.time)
    })
})

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