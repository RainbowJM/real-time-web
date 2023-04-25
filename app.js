const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(http);
const port = process.env.PORT || 8080
const bodyParser = require('body-parser')
// const entities = require("entities")

app.use(express.static(path.resolve('public')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.urlencoded({extended: true}));

app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

let appRoutes = require('./routes/routes');
app.use('/', appRoutes);

io.on("connection", (socket) => {
    console.log('user connected');

    socket.on('message', (message) => {
        // while (history.length > historySize) {
        //   history.shift()
        // }
        // history.push(message)

        io.emit('message', {
            message: message.message,
            name: message.name
        })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
});

http.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
});
