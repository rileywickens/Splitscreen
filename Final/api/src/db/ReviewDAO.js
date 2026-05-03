const db = require('./DBConnection');
const Review = require('./models/Review');
const User = require('./models/User');
const Game = require('./models/Game');

const REVIEW_JOIN_QUERY = `
    SELECT r.*, 
           u.usr_id, u.usr_first_name, u.usr_last_name, u.usr_username,
           g.gme_id, g.gme_slug, g.gme_name, g.gme_image
    FROM review r
    JOIN user u ON r.rev_usr_id = u.usr_id
    JOIN game g ON r.rev_gam_id = g.gme_id
`;

const mapReview = (row) => {
    const review = new Review(row);
    review.setUser(new User(row));
    review.setGame(new Game(row));
    return review;
};

module.exports = {

    // POST new review
    createReview: (userId, gameId, score, reviewMessage) => {
        return new Promise((resolve, reject) => {
            if (!userId || !gameId || !score) {
                reject({ code: 400, message: "Missing required review information" });
            }

            if (score < 1 || score > 5) {
                reject({ code: 400, message: "score must be between 1 and 5" });
            }

            return db.query(
                `INSERT INTO review (rev_usr_id, rev_gam_id, rev_score, rev_message)
                VALUES (?, ?, ?, ?)`,
                [userId, gameId, score, reviewMessage]
            ).then(result => {
                return db.query(`${REVIEW_JOIN_QUERY} WHERE r.rev_id = ?`, [result.insertId]);
            }).then(rows => {
                resolve(mapReview(rows[0]));
            }).catch(err => {
                console.log(err);
                if (err.code === 'ER_DUP_ENTRY') {
                    reject({ code: 409, message: "User has already reviewed this game: " + err });
                } else {
                    reject({ code: 500, message: "Database Error: " + err });
                }
            });
        });
    },

    // PUT existing review
    updateReview: (reviewId, score, reviewMessage) => {
        return new Promise((resolve, reject) => {
            if (score && (score < 1 || score > 5)) {
                reject({ code: 400, message: "score must be between 1 and 5" });
            }

            return db.query(
                `UPDATE review SET rev_score = ?, rev_message = ?
                WHERE rev_id = ?`,
                [score, reviewMessage, reviewId]
            ).then(result => {
                if (result.affectedRows === 0) {
                    reject({ code: 404, message: "Review not found or unauthorized" });
                    return;
                }
                resolve(true);
            }).catch(err => {
                console.log(err);
                reject({ code: 500, message: "Database Error: " + err });
            });
        });
    },

    // GET existing review
    getReviewById: (reviewId) => {
        return db.query(
            `${REVIEW_JOIN_QUERY} WHERE r.rev_id = ?`, [reviewId]
        ).then(rows => {
            if (rows.length === 1) {
                return mapReview(rows[0]);
            }
            return new Error("Review not found");
        });
    },

    // GET reviews by user
    getReviewsByUser: (userId) => {
        return db.query(
            `${REVIEW_JOIN_QUERY} WHERE r.rev_usr_id = ? ORDER BY r.rev_created_at DESC`, [userId]
        ).then(rows => rows.map(mapReview));
    },

    // GET reviews by game
    getReviewsByGame: (gameId) => {
        return db.query(
            `${REVIEW_JOIN_QUERY} WHERE r.rev_gam_id = ? ORDER BY r.rev_created_at DESC`, [gameId]
        ).then(rows => rows.map(mapReview));
    },

    // GET reviews by user for game
    getUserReviewForGame: (userId, gameId) => {
        return db.query(
            `${REVIEW_JOIN_QUERY} WHERE r.rev_usr_id = ? AND r.rev_gam_id = ?`, [userId, gameId]
        ).then(rows => {
            if (!rows[0]) return null;
            return mapReview(rows[0]);
        });
    },

    // GET all reviews (for home page)
    getAllReviews: () => {
        return db.query(
            `${REVIEW_JOIN_QUERY} ORDER BY r.rev_created_at DESC`
        ).then(rows => rows.map(mapReview));
    },

    // GET average score
    getAverageScoreForGame: (gameId) => {
        return db.query(
            `SELECT AVG(rev_score) AS average_score, COUNT(*) AS total_reviews
             FROM review WHERE rev_gam_id = ?`,
            [gameId]
        ).then(rows => {
            return rows[0];
        });
    },

    // DELETE a review
    deleteReview: (reviewId, userId) => {
        return db.query(
            `DELETE FROM review WHERE rev_id = ? AND rev_usr_id = ?`,
            [reviewId, userId]
        ).then(result => {
            return result.affectedRows > 0;
        });
    },
};