const socket = io()
const messages = document.querySelector('section ul')
const input = document.querySelector('#message-input');
const submit = document.querySelector('#message-button');

submit.addEventListener('click', event => {
    event.preventDefault()
    if (input.value) {
        const chat = {
            // username: usernameInput.value,
            message: input.value
        }
        socket.emit('message', chat)
        input.value = ''
    }
});

socket.on('message', message => {
    const li_element = document.createElement('li');
    li_element.textContent = `${message.message} `;
    // li_element.setAttribute('class', 'talk-bubble tri-right border round btm-left-in');
    messages.appendChild(li_element);
    messages.scrollTop = messages.scrollHeight;
});