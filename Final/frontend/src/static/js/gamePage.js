import api from './APIClient.js';

const featuredGame = document.querySelector('.featured-game');

const query = globalThis.location.search;
let parameters = new URLSearchParams(query);
const id = parameters.get('id');

api.getGameById(id).then(game => {
    console.log(game);
    featuredGame.querySelector('#featured-game-link').href=`/game?id=${game.id}`;
    featuredGame.querySelector('#featured-game-image').src=game.image;
    featuredGame.querySelector('#featured-game-image').alt=`${game.name} cover photo`;
    featuredGame.querySelector('#featured-game-title').innerText = game.name;

    const date = new Date(game.release_date);
    featuredGame.querySelector('.release-date').innerText += ` ${date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}`;

    document.querySelector('#age-rating').innerText += ` ${game.age_rating}`;

    let genresList = featuredGame.querySelector('#genres-list');
    for (const element of game.genres) {
        genresList.innerHTML += `<div class='genre'>${element}</div>`;
    }

    let platformsList = featuredGame.querySelector('#platforms-list');
    for (const element of game.platforms) {
        platformsList.innerHTML += `<div class='platform'>${element}</div>`;
    }

    let developerList = document.querySelector('#developer-list');
    for (const element of game.publishers) {
        developerList.innerHTML += `<div class='developer'>${element}</div>`;
    }

    let publisherList = document.querySelector('#publisher-list');
    for (const element of game.developers) {
        publisherList.innerHTML += `<div class='publisher'>${element}</div>`;
    }

    let tagList = document.querySelector('#tag-list');
    for (const element of game.tags) {
        tagList.innerHTML += `<div class='tag'>${element}</div>`;
    }

    for (let i = 5; i > 0; i--) {
        featuredGame.querySelector(`#star-${i}`).innerText += ` ${game.ratings[5 - i]}`;
    }
});