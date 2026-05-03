const db = require('./DBConnection');
const Game = require('./models/Game');

module.exports = {
    createNewGame: (unprocessedGame) => {
        return db.query('INSERT INTO game (gme_slug, gme_name, gme_image) VALUES (?, ?, ?) RETURNING *',
            [unprocessedGame.slug, unprocessedGame.name, unprocessedGame.background_image]).then(rows => {
            if (!rows[0]) {
                console.log('Error: User could not be created');
                return new Error('Error unable to create game: ' + err);
            }
            let game = new Game(rows[0]);
            return game;
        }).catch(err => {
            console.log(err);
            return new Error("Database Error: " + err);
        })
    },

    fillGameContent: async (unprocessedGame, game) => {

        if (unprocessedGame.genres) {
            for (const genre of unprocessedGame.genres) {
                game.addGenre(genre.name);
            }
        }

        if (game.genres?.length <= 0) {
            game.addGenre('Unassigned');
        }

        if (unprocessedGame.platforms) {
            for (const platform of unprocessedGame.platforms) {
                game.addPlatform(platform.platform.name);
            }
        }

        if (game.platforms?.length <= 0) {
            game.addPlatform('Unassigned');
        }

        if (unprocessedGame.ratings) {
            for (const rating of unprocessedGame.ratings) {
                game.addRating(rating.count);
            }
            while (game.ratings.length < 5) {
                game.addRating(0);
            }
        }

        if (unprocessedGame.tags) {
            for (let i = 0; i < Math.min(unprocessedGame.tags.length, 15); i++) {
                game.addTag(unprocessedGame.tags[i].name);
            }
        } else {
            game.addTag('unassigned');
        }
        
        game.setReleaseDate(unprocessedGame.released);
        if (unprocessedGame.esrb_rating) {
            game.setAgeRating(unprocessedGame.esrb_rating.name);
        } else {
            game.setAgeRating('Unrated');
        }

        if (unprocessedGame.publishers) {
            for (const publisher of unprocessedGame.publishers) {
                game.addPublisher(publisher.name);
            }
        }

        if (unprocessedGame.developers) {
            for (const developer of unprocessedGame.developers) {
                game.addDeveloper(developer.name);
            }
        }
        
    },

    checkGameExists: (slug) => {
        return db.query('SELECT COUNT(*) AS total FROM game WHERE gme_slug=?', [slug]).then(count => {
            return count[0].total === 1n;
        });
    },

    getGameBySlug: (slug) => {
        return db.query('SELECT * FROM game WHERE gme_slug=?', [slug]).then(rows => {
            if (rows.length === 1) {
                return new Game(rows[0]);
            }
            return new Error("No such Game");
        });
    },

    getGameByName: (name) => {
        return db.query('SELECT * FROM game WHERE gme_name=?', [name]).then(rows => {
            if (rows.length === 1) {
                return new Game(rows[0]);
            }
            return new Error("No such Game");
        });
    },

    getGameById: (gameId) => {
        return db.query('SELECT * FROM game WHERE gme_id=?', [gameId]).then(rows => {
            if (rows.length === 1) {
                return new Game(rows[0]);
            }
            return new Error("No such Game");
        });
    }
};
