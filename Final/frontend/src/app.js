const express = require('express');

const app = express();
const PORT = process.env.PORT;

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/templates/home-page.html');
});

app.get('/auth', (req, res) => {
  res.sendFile(__dirname + '/templates/home-page-auth.html');
});

app.get('/game', (req, res) => {
  res.sendFile(__dirname + '/templates/game-page.html');
});

app.get('/gameauth', (req, res) => {
  res.sendFile(__dirname + '/templates/game-page-auth.html');
});

app.get('/user', (req, res) => {
    const id = req.query.id;
    if (id !== undefined && (isNaN(id) || id <= 0)) {
        res.redirect('/auth');
        return;
    }
    res.sendFile(__dirname + '/templates/user-page.html');
});

// Catch all unmatched routes and redirect to home
app.get('*', (req, res) => {
  res.redirect('/');
});

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));