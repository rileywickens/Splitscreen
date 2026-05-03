const express = require('express')
const cookieParser = require('cookie-parser');
const router = express.Router({ mergeParams: true })

router.use(cookieParser());
router.use(express.json());
const { TokenMiddleware } = require('../middleware/TokenMiddleware');
const UserDAO = require('../db/UserDAO');

// GET current user
router.get('/current', TokenMiddleware, (req, res) => {
    res.json(req.user);
});

// GET specific user by id
router.get('/id/:userId', TokenMiddleware, (req, res) => {
    if (req.params.userId) {
        UserDAO.getSpecificUser(req.params.userId).then(user => {
            res.json(user);
        }).catch(err => {
            res.status(err.code || 404).json({ error: 'User not found' });
        });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

// GET user's friends
router.get('/:userId/friends', TokenMiddleware, (req, res) => {
    const { userId } = req.params;
    UserDAO.getUserFriends(userId)
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ error: err.message }));
});

// GET search for user by username
router.get('/name/:username', TokenMiddleware, (req, res) => {
    if (req.params.username) {
        UserDAO.searchForUser(req.params.username).then(user => {
            res.json({ id: user.id });
        }).catch(err => {
            res.status(err.code || 500).json({ error: err.message });
        });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

// PUT update user info
router.put('/update/:username', TokenMiddleware, (req, res) => {
    if (req.user && req.params.username) {
        UserDAO.updateUser(req.user.id, req.params.username).then(status => {
            req.user.username = req.params.username;
            res.json({ status: status });
        }).catch(err => {
            res.status(err.code || 500).json({ error: err.message });
        });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

module.exports = router