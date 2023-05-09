const socket = io();
const messages = document.querySelector('section#chat ul');
const input = document.querySelector('#message-input');
const nameTitle = document.querySelector('p#name');
// const nameIput = document.querySelector('#name-input');
const submitMessage = document.querySelector('#message-button');
const submitName = document.querySelector('#name-button');
let names = document.querySelector('section#players ul');
let messageLast = '';

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

socket.emit('user', nameTitle.textContent);

socket.on('message', message => {
    if (message.id != socket.id) {
        add(message.message, message.name, message.id, message.time)
    }
});

socket.on('username', username => {
    console.log(username);
    names.innerHTML('beforeend',
        `<li>${username.name}</li>`)
});

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