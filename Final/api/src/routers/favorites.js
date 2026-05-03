const express = require('express')
const cookieParser = require('cookie-parser');
const router = express.Router({ mergeParams: true })

router.use(cookieParser());
router.use(express.json());
const { TokenMiddleware } = require('../middleware/TokenMiddleware');
const UserDAO = require('../db/UserDAO');
const GameDAO = require('../db/GameDAO');


//Get a specific user's favorite games
router.get('/:userId', TokenMiddleware, (req,  res) => {
  if(req.params.userId) {
    UserDAO.getUserFavoriteGameIds(req.params.userId).then( async gameIds => {
      let games = [];
      for (let gameId of gameIds) {
        let game = await GameDAO.getGameById(gameId);
        if (game) games.push(game);
      }
      res.send(games);
    }).catch(err => {
      res.status(err.code || 500).json({error: err.message});
    });
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }
});

//Favorite a game
router.post('/:gameId', TokenMiddleware, (req,  res) => {
  if(req.user && req.params.gameId) {
    UserDAO.addFavoriteGame(req.user.id, req.params.gameId).then(status => {
        res.json({status: status});
    }).catch(err => {
      res.status(err.code || 500).json({error: err.message});
    });
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }
});

//Delete a favorite game
router.delete('/:gameId', TokenMiddleware, (req,  res) => {
  if(req.user && req.params.gameId) {
    UserDAO.removeFavoriteGame(req.user.id, req.params.gameId).then(status => {
        res.json({status: status});
    }).catch(err => {
      res.status(err.code || 500).json({error: err.message});
    });
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }
});

module.exports = router