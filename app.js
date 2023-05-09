const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    'https://fgjcfncjxisqiskmnpes.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnamNmbmNqeGlzcWlza21ucGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI0MTE5MjksImV4cCI6MTk5Nzk4NzkyOX0.jTjFjKrk83Eu1U0xXzw6i75M2YexAkhCGAEm6OymuUw'
);
const historySize = 100;
let username;
let currentWord = null;
let currentWordId = null;
let onlinePlayers = [];
let history = [];
let typing = [];

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(express.static(path.resolve('public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    if (req.body.name) {
        username = req.body.name
    }
    if (!currentWord) {
        currentWord = await getWord();
    }
    res.render('trivia',
        {
            name: username,
            data: currentWord
        });
});

io.on("connection", (socket) => {
    console.log('user connected');

    socket.emit('history', history)

    socket.on('user', (user) => {
        onlinePlayers.push([user, socket.id, 0]);
        io.emit('users', onlinePlayers);
    });

    socket.on('message', (message) => {
        while (history.length > historySize) {
            history.shift()
        }
        history.push(message)

        io.emit('message', {
            message: message.message,
            name: message.name,
            id: socket.id,
            time: message.time
        })
    })

    socket.on("typing", (client) => {        
        let exists = false
        
        // Check if the client is already in the array.
        typing.forEach((client) => {
            if (client[1] == socket.id) {

                exists = true
            }
        })

        if (client.typing && !exists) {
            // Add the name and connection ID to the list of typing clients.
            typing.push([client.name, socket.id])
        } else if (!client.typing) {
            // Remove the name and connection ID from the list of typing clients.
            typing.forEach((client, index) => {
                if (client[1] == socket.id) {
                    typing.splice(index, 1);
                }
            })
        }
        
        // Emit the array of typing clients.
        io.emit("typing", typing)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
});

async function getWord() {
    currentWordId = Math.floor(Math.random() * 21) + 1;
    const { data, error } = await supabase
        .from('words')
        .select()
        .eq('id', currentWordId);
    return data[0];
}

http.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
});