const express = require('express');
const router = express.Router();
let username;
let currentWord = null

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/', async (req,res) => {
    if(req.body.name){
        username = req.body.name
    }
    if(!currentWord){
        currentWord = await getWords();
        console.log(currentWord);
    }
    res.render('trivia',
    {
        name: username,
        word: currentWord
    });
});

getWords = () => {
    return fetch(`https://fgjcfncjxisqiskmnpes.supabase.co/rest/v1/Word`)
      .then(response => response.json())
}
module.exports = router;