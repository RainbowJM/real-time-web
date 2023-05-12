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
let nextWord;
let description;

run();

app.use(express.static(path.resolve('public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    // Get the username from the form.
    if (req.body.name) {
        username = req.body.name
    }
    if (!currentWord) {
        // Get a word.
        currentWord = await getWord();
        // Get the description of the word.
        description = currentWord.descr;
    }
    // Render the trivia page.
    res.render('trivia',
        {
            name: username,
            data: currentWord
        });
});

io.on("connection", (socket) => {
    console.log('user connected');

    socket.emit('history', history);

    socket.emit('data', currentWord);

    socket.on('user', (user) => {
        // Add the user to the list of connected users.
        onlinePlayers.push([user, socket.id, 0]);
        // Emit the list of connected users.
        io.emit('users', onlinePlayers);
    });

    socket.on('message', (message) => {
        // Add the message to the history.
        while (history.length > historySize) {
            // Remove the oldest message.
            history.shift()
        }
        // Add the message to the history.
        history.push(message)

        // Emit the message to all connected users.
        io.emit('message', {
            message: message.message,
            name: message.name,
            id: socket.id,
            time: message.time
        })
    })

    socket.on("typing", (user) => {
        let exists = false

        // Check if the user is already in the array.
        typing.forEach((client) => {
            if (client[1] == socket.id) {
                exists = true
            }
        })

        if (user.typing && !exists) {
            // Add the name and connection ID to the list of typing users.
            typing.push([user.name, socket.id])
        } else if (!user.typing) {
            // Remove the name and connection ID from the list of typing users.
            typing.forEach((client, index) => {
                if (client[1] == socket.id) {
                    // Remove the user from the list of typing users.
                    typing.splice(index, 1);
                }
            })
        }

        // Emit the array of typing users.
        io.emit("typing", typing)
    })

    socket.on('answer', (correct) => {
        if (correct) {
            // Update the score within the list of connected users.
            onlinePlayers.forEach((client, index) => {
                if (client[1] == socket.id) {
                    // Increase the score of the user.
                    onlinePlayers[index][2]++
                }
            })

            // Sort the list of connected users based on the score (descending).
            onlinePlayers.sort(function (a, b) {
                return b[2] - a[2]
            })

            // Emit the names, connection IDs and scores of the connected users.
            io.emit('users', onlinePlayers)

            // Emit the description of the word.
            io.emit('description', description);

            // Get a new word
            run();
            // Emit the new word.
            io.emit('next word', nextWord);
        } else {
            // Emit that the answer was wrong.
            io.emit('wrong answer')
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
        // Remove the user from the list of connected users.
        onlinePlayers.forEach((client, index) => {
            if (client[1] == socket.id) {
                // Remove the user from the list of connected users.
                onlinePlayers.splice(index, 1)
                io.emit('disconnected', client[0]);
            }
        })
        // Emit the list of connected users.
        io.emit('users', onlinePlayers);
    })
});

async function getWord() {
    // Get a random word from the database.
    currentWordId = Math.floor(Math.random() * 22) + 1;
    const { data, error } = await supabase
        .from('words')
        .select()
        .eq('id', currentWordId);
    return data[0];
}

function getNextWord(currentWord) {
    // Get a new word.
    return new Promise((resolve, reject) => {
        getWord()
            .then((data) => {
                if (data !== currentWord) {
                    currentWord = data;
                    resolve(currentWord);
                } else {
                    return getNextWord(currentWord); // Recursively call getNextWord with the same currentWord
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

async function run() {
    nextWord = await getNextWord(currentWord);
}

http.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
});