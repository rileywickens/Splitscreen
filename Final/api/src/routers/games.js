const express = require('express')
const cookieParser = require('cookie-parser');
const router = express.Router({ mergeParams: true });
const GameDAO = require('../db/GameDAO');

router.use(cookieParser());
router.use(express.json());

//Title, Pictue, Genres, Ratings, Platforms, Age_ratings, release date, developers, publishers, gamemodes

router.get('/featured', async (req, res) => {
    if (!process.env?.RAWG_API_KEY) {
        console.log("Error: No API KEY");
        res.status(401).json({ error: 'Unable to retrieve RAWG Api Key'});
        return;
    }

    getFeatured().then(game => {
        res.json(game);  
    }).catch(err => {
        console.log(err);
        res.status(err.code || 500).json({ error: err.message });
    })
});

let getFeatured = async () => {
    const d = new Date();
    const formattedPastDate = (d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear()) + '-' + (d.getMonth() === 0 ? 12 : d.getMonth()).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
    const formattedDate = d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');

    const params = new URLSearchParams();
    params.append("key", process.env.RAWG_API_KEY);
    params.append("dates", `${formattedPastDate},${formattedDate}`);
    params.append("ordering", '-rating');
    params.append("page_size", '20');

    const param2 = new URLSearchParams();
    param2.append("key", process.env.RAWG_API_KEY);

    const index = Math.floor(Math.random() * 20);

    const response = await fetch(`https://api.rawg.io/api/games?${params}`)
    const data = await response.json();
    let game_data = data.results[index];

    if (!game_data.name || !game_data.slug || !game_data.background_image) {
        return getFeatured();
    }

    let game;
    if(await GameDAO.checkGameExists(data.results[index].slug)) {
        game = await GameDAO.getGameBySlug(data.results[index].slug);
    } else {
        game = await GameDAO.createNewGame(data.results[index]);
    }
    await GameDAO.fillGameContent(game_data, game);
    return game;
}

router.get('/recent', async (req, res) => {
    if (!process.env?.RAWG_API_KEY) {
        console.log("Error: No API KEY");
        res.status(401).json({ error: 'Unable to retrieve RAWG Api Key'});
        return;
    }

    const d = new Date();
    const formattedPastDate = (d.getMonth() === 0 ? d.getFullYear() - 1 : d.getFullYear()) + '-' + (d.getMonth() === 0 ? 12 : d.getMonth()).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
    const formattedDate = d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');

    const params = new URLSearchParams();
    params.append("key", process.env.RAWG_API_KEY);
    params.append("dates", `${formattedPastDate},${formattedDate}`);
    params.append("ordering", '-added');
    params.append("page_size", '10');

    fetch(`https://api.rawg.io/api/games?${params}`)
      .then(response => response.json())
      .then(async data => {
        let games = [];
        for (const unprocessed_game of data.results) {
            let game;
            if(await GameDAO.checkGameExists(unprocessed_game.slug)) {
                game = await GameDAO.getGameBySlug(unprocessed_game.slug);
            } else {
                game = await GameDAO.createNewGame(unprocessed_game);
            }
            games.push(game);
        }
        res.send(games);
      }).catch(error => {
        console.log('Error:', error);
        res.status(500).json({ error: 'Failed to fetch' });
      })
});

router.get('/anticipated', async (req, res) => {
    if (!process.env?.RAWG_API_KEY) {
        console.log("Error: No API KEY");
        res.status(401).json({ error: 'Unable to retrieve RAWG Api Key'});
        return;
    }

    const d = new Date();
    const formattedDate = d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
    const formattedFutureDate = (d.getFullYear() + 1) + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');

    const params = new URLSearchParams();
    params.append("key", process.env.RAWG_API_KEY);
    params.append("dates", `${formattedDate},${formattedFutureDate}`);
    params.append("ordering", '-added');
    params.append("page_size", '10');

    fetch(`https://api.rawg.io/api/games?${params}`)
      .then(response => response.json())
      .then(async data => {
        let games = [];
        for (const unprocessed_game of data.results) {
            let game;
            if(await GameDAO.checkGameExists(unprocessed_game.slug)) {
                game = await GameDAO.getGameBySlug(unprocessed_game.slug);
            } else {
                game = await GameDAO.createNewGame(unprocessed_game);
            }
            games.push(game);
        }
        res.send(games);
      }).catch(error => {
        console.log('Error:', error);
        res.status(500).json({ error: 'Failed to fetch' });
      })
});

router.get('/id/:gameId', async (req, res) => {
    const gameId = req.params.gameId;
    let game;
    try { game = await GameDAO.getGameById(gameId); } 
    catch (err) {
        console.log(err);
        res.status(404).json({error: 'Game not found'});
    }

    fetch(`https://api.rawg.io/api/games/${game.slug}?key=${process.env.RAWG_API_KEY}`)
    .then(response => response.json())
    .then(async data => {
        let game_data = data;
        await GameDAO.fillGameContent(game_data, game);
        res.json(game);
    }).catch(error => {
        console.log('Error:', error);
        res.status(500).json({ error: 'Failed to fetch' });
    })
});

router.get('/name/:gameName', async (req, res) => {
    const gameName = req.params.gameName;
    try {
        const game = await GameDAO.getGameByName(gameName);
        res.json(game);
        return;
    } catch (error) { console.log('Game not in Database.'); }
    
    const structuredName = gameName.toLowerCase().replaceAll(' ', '-');
    fetch(`https://api.rawg.io/api/games/${structuredName}?key=${process.env.RAWG_API_KEY}`)
    .then(response => response.json())
    .then(async data => {
        let game = await GameDAO.createNewGame(unprocessed_game);
        res.json(game);
    }).catch(error => {
        console.log('Error:', error);
        res.status(500).json({ error: 'Game not found.' });
    })
});

module.exports = router;