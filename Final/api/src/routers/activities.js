const express = require('express')
const cookieParser = require('cookie-parser');
const router = express.Router({ mergeParams: true })
const activityDAO = require('../db/ActivityDAO');
const { TokenMiddleware } = require('../middleware/TokenMiddleware');
router.use(cookieParser());
router.use(express.json());

// GET all activities for a user
router.get('/:userId', TokenMiddleware, (req, res) => {
    if (req.params.userId) {
        activityDAO.getActivitiesByUser(req.params.userId)
            .then(activities => res.json(activities))
            .catch(err => {
                console.log(err);
                res.status(err.code || 500).json({ error: err.message })
            });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

// GET status of a specific game for a user
router.get('/game/:gameId/:userId', TokenMiddleware, (req, res) => {
    if (req.params.userId && req.params.gameId) {
        activityDAO.getActivityByUserAndGame(req.params.userId, req.params.gameId)
        .then(activity => {
            if (!activity) {
                return res.json({ status: null });
            }
            res.json({ status: activity.action });
        })
        .catch(err => {
            console.log(err);
            res.status(err.code || 500).json({ error: err.message })
        });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

// PUT set or update status for a user's game (creates if doesn't exist)
router.put('/game/:gameId/:userId', TokenMiddleware, (req, res) => {
    if (req.params.userId && req.params.gameId && req.body.status) {
        const { status } = req.body;
        activityDAO.setActivityStatus(req.params.userId, req.params.gameId, status)
            .then(() => res.json({ message: `Status updated to: ${status}` }))
            .catch(err => {
                console.log(err);
                res.status(err.code || 500).json({ error: err.message })
            });
     } else {
        res.status(400).json({ error: 'Credentials not provided' });
     }
});

// DELETE clear status for a user's game (set to NULL)
router.delete('/game/:gameId/:userId', TokenMiddleware, (req, res) => {
    if (req.params.userId && req.params.gameId) {
        activityDAO.clearActivityStatus(req.params.userId, req.params.gameId)
            .then(() => res.json({ message: `Status cleared for game ${gameId}` }))
            .catch(err => {
                console.log(err);
                res.status(err.code || 500).json({ error: err.message })
            });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

module.exports = router