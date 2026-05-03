const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const login = require('./routers/login')
const logout = require('./routers/logout')
const register = require('./routers/register')
const users = require('./routers/users')
const reviews = require('./routers/reviews')
const activities = require('./routers/activities')
const friends = require('./routers/friends')
const games = require('./routers/games')
const favorites = require('./routers/favorites')

app.use(express.json());
app.use('/login', login);
app.use('/logout', logout);
app.use('/register', register);
app.use('/users', users);
app.use('/reviews', reviews);
app.use('/activities', activities);
app.use('/friends', friends);
app.use('/games', games);
app.use('/favorite', favorites);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));