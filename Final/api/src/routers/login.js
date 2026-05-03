const express = require('express')
const cookieParser = require('cookie-parser');
const router = express.Router({ mergeParams: true })
const UserDAO = require('../db/UserDAO');

router.use(cookieParser());
router.use(express.json());
const { generateToken } = require('../middleware/TokenMiddleware');

//Login
router.post('/', (req,  res) => {
  if(req.body.username && req.body.password) {
    UserDAO.getUserByCredentials(req.body.username, req.body.password).then(user => {
      generateToken(req, res, user);
      res.json({user: user});
    }).catch(err => {
      res.status(err.code || 500).json({error: err.message});
    });
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }
});

module.exports = router