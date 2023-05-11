# [Papiamentu Trivia](https://humble-morning-production.up.railway.app/)
## Table of content
- [Papiamentu Trivia](#papiamentu-trivia)
  - [Table of content](#table-of-content)
  - [Description](#description)
  - [Proof of Concept](#proof-of-concept)
    - [Idea 1 - Guess the artist](#idea-1---guess-the-artist)
    - [Idea 2 - Blackjack game](#idea-2---blackjack-game)
    - [Idea 3 - Trivia game](#idea-3---trivia-game)
  - [Concept](#concept)
    - [Functionalities](#functionalities)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API](#api)
  - [Data life cycle](#data-life-cycle)
  - [Data modeling](#data-modeling)
  - [Real time events](#real-time-events)
  - [Live demo](#live-demo)
---
## Description
The assigment was to develop a chat that receives and distributes data in real time. 
The real time application is a application that conside of a chat room.
The chat room receives and destributes data in real time.
And the extra feature is that you can play a trivia game.

## Proof of Concept
Proof of concept is a design method where you think about three possible ideas that can be implemented. 
In this case, this method was used to create three concepts to build an real-time Web application. 

### Idea 1 - Guess the artist
The idea was to that you as user will guess the artist of the song, in a game room.

The API that will be used for this idea is the `Spotify API`

### Idea 2 - Blackjack game
The idea was to make a room where you can game with each ohter and it has it own chat room.

The API that will be used for this idea is the `Card API`

### Idea 3 - Trivia game
The idea was to make a trivia game where you have to guess the world in Papiamentu.

The API that will be used for this idea is the `Emoij API` for the scoring.

## Concept
The final concept is now the Trivia game, with some changes then the previous idee.

`Papiamentu Trivia` is a chat application where a group of people can play a trivia game in a chat room. 
While learning the language `Papiamentu`, getting to know new words in `Papiamentu' is a very important part of the learning process.

What it entails is that group of people enter a chat room and get a word in 'Papiamentu' and they have to guess/say the correct translation of the word in 'English'.
When one that says the correct translation of the word, he/she will get a point.
The one with the most points wins the game.
WHen the correct translation is guessed the word will be changed to another word.
And for a short amount of time the discription of the uessed word will be shown.
On the side is the user list. The list shows all users who are logged into the chat and the current score. Furthermore, others can see who is currently online.

### Functionalities
#### Core Functionalities
- [X] User can enter a chatroom
- [X] User can to give a username when entre
- [X] User can see the names of other users in the room
- [X] User can see when someone is typing
- [X] User can see when someone has guessed the correct word
- [X] User can see when someone has guessed the wrong word
- [X] User can see when someone has send a message

#### Must have
- [X] User can see the current word
- [X] User can see the description of the current word
- [X] User can see the current score of the users
- [X] Chats are saved
- [X] User can see the time when the message was send
- [] User can see when someone join the room
- [] User can see when someone leaves the room

#### Should have
- [ ] Instruction when join the room how the game works
- [X] Works on Ipad
- [ ] Works on mobile
- [ ] Offline mode
- [ ] User can see the words he/she has guessed

#### Could have
- [ ] The application has rooms
- [ ] User can see which room he/she is in
- [ ] User can see which room other users are in

#### Would have
- [ ] User can added more words to the game
- [ ] User can see the words he/she has added
- [ ] User can see the words other users have added

#### Techniques used
- [X] Input area for username and message
- [X] Send button for username and message
- [X] Chat area for messages
- [X] Chat area for users
- [X] Chat area for current word

## Installation
The installation of this project is very easy. 
In this part you can read how to install this project.
Just follow the steps below.

What you need to install for this project:
- [Node.js](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [EJS](https://ejs.co/)
- [Nodemon](https://www.npmjs.com/package/nodemon)

For deployment [Railway](https://railway.app/) was used and the main one.
But [Adaptable](https://adaptable.io/) was also used for backup.

### Clone repository
``` git clone https://github.com/RainbowJM/real-time-web```

### Install dependencies
To install the dependencies you have to run the following command in your terminal:
``` npm install node-js```
``` npm install express ```
``` npm install socket.io ```
``` npm install ejs ```
``` npm install nodemon ```

### Start server
``` npm run dev ```

### Express server
When you have installed the `Express` dependencies you can start using it in the project.

The code below is the basic code to start using express in your project. 
This will be in the `app.js` file.
``` javascript
const express = require('express')
const app = express()
const port = process.env.PORT || 8080;

app.use(express.static(path.resolve('public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

http.listen(port, () => {
    console.log(`Example app listening on  http://localhost:${port}`)
});
```

For the fetch request you can use the code below.
``` javascript
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    if (req.body.name) {
        username = req.body.name
    }
    if (!currentWord) {
        currentWord = await getWord();
        description = currentWord.descr;
    }
    res.render('trivia',
        {
            name: username,
            data: currentWord
        });
});
```

### Socket.io
When you have installed the `Socket.io` dependencies you can start using it in the project.

The code below is the basic code to start using socket.io in your project. 
This will be in the `app.js` file.

``` javascript
const io = require('socket.io')(http);
const http = require('http').createServer(app);

io.on('connection', (socket) => {
	console.log('a user connected');
});
```

### Nodemon
When you have installed the `Nodemon` dependencies you can start using it in the project.

The code below is the basic code to start using nodemon in your project.
This will be in the `package.json` file.

``` json
"scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

### EJS
When you have installed the `EJS` dependencies you can start using it in the project.

The code below is the basic code to start using EJS in your project.
This will be in the `app.js` file.

``` javascript
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');
```

## Usage
### Home page
When the user arrives to the web application, first thing he/she will see is the input area for username.
When the user enters a username and clicks on the send button, the user will be redirected to the chatroom.

### Chatroom
When the user arrives to the chatroom, the user will see the input area for messages.
When the user enters a message and clicks on the send button, the message will be send to the chatroom.
<img width="1347" alt="Screenshot 2023-05-11 at 14 09 45" src="https://github.com/RainbowJM/real-time-web/assets/59873140/35223561-c4d3-485b-be7c-c6c6266804a7">

## API
## Data life cycle
## Data modeling
## Real time events
## Live demo
The best live demo version of this project can be found [here](https://humble-morning-production.up.railway.app/).

The other version has some problemn with the sockets but you can still use it [here](https://papiamentu-trivia.adaptable.app/).



