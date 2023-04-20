const express = require('express');
const router = express.Router();
let username;

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/', (req,res) => {
    if(req.body.name){
        username = req.body.name
    }
    res.render('trivia',
    {
        name: username
    });
});

module.exports = router;