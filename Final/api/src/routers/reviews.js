const express = require('express')
const cookieParser = require('cookie-parser');
const router = express.Router({ mergeParams: true })
const reviewDAO = require('../db/ReviewDAO');
const { TokenMiddleware } = require('../middleware/TokenMiddleware');

router.use(express.json());
router.use(cookieParser());

//Post new review
router.post('/', TokenMiddleware, async (req, res) => {
    if (req.body.userId && req.body.gameId && req.body.score && req.body.reviewMessage) {
        const { userId, gameId, score, reviewMessage } = req.body;
        reviewDAO.createReview(userId, gameId, score, reviewMessage)
        .then(review => res.status(201).json(review))
        .catch(err => {
            console.log(err);
            res.status(err.code || 500).json({ error: err.message })
        });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }

});

//Update existing review
router.put('/:reviewId', TokenMiddleware, (req, res) => {
    if (req.params.reviewId && req.body.score && req.body.reviewMessage) {
        const { reviewId } = req.params;
        const { score, reviewMessage } = req.body;
        reviewDAO.updateReview(reviewId, score, reviewMessage)  // changed .update to .updateReview
            .then(() => res.json({ message: `Review ${reviewId} updated.` }))
            .catch(err => {
                console.log(err);
                res.status(err.code || 500).json({ error: err.message })
            });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

//Get all reviews posted by a user
router.get('/user/:userId', TokenMiddleware, (req,  res) => {
    if (req.params.userId) {
        const { userId } = req.params;
        reviewDAO.getReviewsByUser(userId)
        .then(reviews => {
            if (reviews instanceof Error) {
                return res.status(404).json({ error: review.message });
            }
            res.json(reviews);
        })
        .catch(err => {
            console.log(err);
            res.status(err.code || 500).json({ error: err.message })
        });
    } else {
         res.status(400).json({ error: 'Credentials not provided' });
    }
});

//Get all reviews for a game
router.get('/game/:gameId', TokenMiddleware, (req,  res) => {
    if (req.params.gameId) {
        const { gameId } = req.params;
        reviewDAO.getReviewsByGame(gameId)
        .then(reviews => {
            if (reviews instanceof Error) {
                return res.status(404).json({ error: review.message });
            }
            res.json(reviews);
        })
        .catch(err => {
            console.log(err);
            res.status(err.code || 500).json({ error: err.message })
        });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

//Get user's review for a game
router.get('/specific/:userId/game/:gameId', TokenMiddleware, (req, res) => {
    if (req.params.gameId && req.params.userId) {
        const { userId, gameId } = req.params;
        reviewDAO.getUserReviewForGame(userId, gameId)
        .then(review => res.json(review))
        .catch(err => {
            console.log(err);
            res.status(err.code || 500).json({ error: err.message })
        });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

// GET all reviews (home page)
router.get('/all', (req, res) => {
    console.log("HERE");
    reviewDAO.getAllReviews()
        .then(reviews => res.json(reviews))
        .catch(err => {
            console.log(err);
            res.status(err.code || 500).json({ error: err.message })
        });
});

//Delete existing review
router.delete('/:reviewId', TokenMiddleware, (req,  res) => {
    if (req.params.reviewId && req.body.userId) {
        const { reviewId } = req.params;
        const { userId } = req.body;
        reviewDAO.deleteReview(reviewId, userId)
        .then(deleted => {
            if (!deleted) {
                return res.status(404).json({ error: 'Review not found or unauthorized.' });
            }
            res.json({ message: `Review ${reviewId} deleted.` });
        })
        .catch(err => {
            console.log(err);
            res.status(err.code || 500).json({ error: err.message })
        });
    } else {
        res.status(400).json({ error: 'Credentials not provided' });
    }
});

module.exports = router