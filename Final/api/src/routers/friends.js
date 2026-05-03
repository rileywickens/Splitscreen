const express = require('express')
const cookieParser = require('cookie-parser');
const router = express.Router({ mergeParams: true })
const UserDAO = require('../db/UserDAO');

router.use(cookieParser());
router.use(express.json());
const { TokenMiddleware } = require('../middleware/TokenMiddleware');

//Add new friend
router.post('/:friendId', TokenMiddleware, (req,  res) => {
  if(req.user && req.params.friendId) {
    UserDAO.addUserFriend(req.user.id, req.params.friendId).then(status => {
      res.json({status: status});
    }).catch(err => {
      res.status(err.code || 500).json({error: err.message});
    });
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }
});

//Get a user's friends
router.get('/all', TokenMiddleware, async (req,  res) => {
  if(req.user) {
    try {
        const data = await UserDAO.getUserFriends(req.user.id)
        console.log(data);
        res.send(data)
    } catch (err) {
        console.log(err);
        res.status(err.code || 500).json({error: err.message});
    };
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }
});

//Check if a user is friend.
router.get('/confirm/:friendId', TokenMiddleware, (req,  res) => {
  if(req.user && req.params.friendId) {
    UserDAO.confirmUserFriend(req.user.id, req.params.friendId).then(status => {
      res.json({status: status});
    }).catch(err => {
      res.status(err.code || 500).json({error: err.message});
    });
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }
});


//Remove a friend & make them unfriend you too.
router.delete('/:friendId', TokenMiddleware, (req,  res) => {
  if(req.user && req.params.friendId) {
    UserDAO.removeUserFriend(req.user.id, req.params.friendId).then(status => {
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