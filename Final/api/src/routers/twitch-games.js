const express = require('express')
const cookieParser = require('cookie-parser');
const router = express.Router({ mergeParams: true });
const GameDAO = require('../db/GameDAO');

router.use(cookieParser());
router.use(express.json());

/*
The plan was to swap to this api over RAWG, unfortunately this API has an incredibly strict rate limit of 4 api requests per second & the requests respond with
id's for other queries. I believe the intended way to use this database is with data dumps and storing as much data as possible on your own database.
I've kept the implementation here to show our development process and hopes that one day we can use this very cool database! - Riley Wickens.
*/

/*
SLUG: slug
NAME: name
COVER: cover
GENRE: genres
PLATFORM: platforms
AGE_RATINGS: age_ratings
RELEASE_DATE: first_release_date
DEVELOPERS & PUBLISHERS: involved_companies
FRANCHISE: franchise
*/

let requestAccess = () => {
    console.log("REQUEST");
    if (!process.env?.TWITCH_CLIENT_ID || !process.env?.TWITCH_CLIENT_SECRET) {
        console.log("Error: Missing Twitch client information");
        res.status(401).json({ error: 'Unable to retrieve Twitch client information'});
        return;
    }

    const params = new URLSearchParams();
    params.append("client_id", process.env.TWITCH_CLIENT_ID);
    params.append("client_secret", process.env.TWITCH_CLIENT_SECRET);
    params.append("grant_type", 'client_credentials');

    return fetch(`https://id.twitch.tv/oauth2/token?${params}`, {
      method: 'POST'
    })
    .then(response => response.json())
    .then(token => {
        console.log("TOKEN GRANTED: ")
        console.log(token);
        process.env.TWITCH_ACCESS_TOKEN = token.access_token;
        return token.expires_in;
    })
    .catch(err => {
        console.log("Error in token request: " + err);
        throw err
    });
}

let validateAccess = async () => {
    console.log("VALIDATE");
    if (!process.env.TWITCH_ACCESS_TOKEN) {
        console.log("No Token: requesting now.");
        try { await requestAccess() }
        catch (err) {
            console.log(err);
            throw err
        }
    }

    fetch(`https://id.twitch.tv/oauth2/validate`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("VALID TOKEN")
        console.log(data);
    })
    .catch(async err => {
        if (err.status === 401) {
            console.log("Expired Token: requesting now.");
            try { 
                await requestAccess();
                console.log("New Token Aquired."); 
            } 
            catch (err) {
                console.log("Error requesting new token.")
                throw err
            }
        } else {
            console.log("Error in token validation: " + err);
            throw err
        }
    });
}

router.get('/anticipated', async (req, res) => {
    console.log("GAME")
    try { await validateAccess(); }
    catch (err) { 
        res.status(401).json({ error: 'Unable to validate IGDB API access'}); 
    };

    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);
    const futureTimeStamp = futureDate.getTime();

    return fetch('https://api.igdb.com/v4/release_dates/', {
        method: 'POST',
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        },
        body: `fields *; where date > ${futureTimeStamp}; sort date asc; limit 10;`,
    })
    .then(response => response.json())
    .then(games => {
        console.log(games)
        res.send(games);
    })
    .catch(error => {
        console.log('Error:', error);
        res.status(500).json({ error: 'Failed to fetch' });
    })
});

router.get('/recent', async (req, res) => {
    console.log("GAME")
    try { await validateAccess(); }
    catch (err) { 
        res.status(401).json({ error: 'Unable to validate IGDB API access'}); 
    };

    const timestamp = Date.now()

    return fetch('https://api.igdb.com/v4/release_dates/', {
        method: 'POST',
        headers: {
            'Client-ID': process.env.TWITCH_CLIENT_ID,
            'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
        },
        body: `fields *; where date < ${timestamp}; sort date desc; limit 10;`,
    })
    .then(response => response.json())
    .then(games => {
        console.log(games)
        res.send(games);
    })
    .catch(error => {
        console.log('Error:', error);
        res.status(500).json({ error: 'Failed to fetch' });
    })
});

module.exports = router;