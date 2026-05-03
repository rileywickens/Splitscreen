import api from './APIClient.js';
import carousel from './carousel.js';

const recentlyReleasedCarouselList = document.querySelector('#rr-carousel-inner');
const comingSoonCarouselList = document.querySelector('#cs-carousel-inner');
const featuredGame = document.querySelector('.featured-game');

const carouselEntryTemplate = document.querySelector('#videogameLesserFeatureTemplate');

api.getFeaturedGame().then(game => {
    featuredGame.querySelector('#featured-game-link').href=`/game?id=${game.id}`;
    featuredGame.querySelector('#featured-game-image').src=game.image;
    featuredGame.querySelector('#featured-game-image').alt=`${game.name} cover photo`;
    featuredGame.querySelector('#featured-game-title').innerText = game.name;

    const date = new Date(game.release_date);
    featuredGame.querySelector('.release-date').innerText += ` ${date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}`;

    let genresList = featuredGame.querySelector('#genres-list');
    for (const element of game.genres) {
        genresList.innerHTML += `<div class='genre'>${element}</div>`;
    }

    let platformsList = featuredGame.querySelector('#platforms-list');
    for (const element of game.platforms) {
        platformsList.innerHTML += `<div class='platform'>${element}</div>`;
    }
    for (let i = 5; i > 0; i--) {
        featuredGame.querySelector(`#star-${i}`).innerText += ` ${game.ratings[5 - i]}`;
    }
});

api.getRecentGames().then(games => {
    games.forEach((game, idx) => {
        const carouselEntryInstance = carouselEntryTemplate.content.cloneNode(true);
        const carouselEntry = carouselEntryInstance.querySelector('.carousel-item');

        if (idx === 0) carouselEntry.classList.add('active');
        carouselEntry.querySelector('#card-link').href=`/game?id=${game.id}`;
        carouselEntry.querySelector('.card-img-top').src=game.image;
        carouselEntry.querySelector('.card-img-top').alt=`${game.name} cover photo`;
        recentlyReleasedCarouselList.appendChild(carouselEntry);
    })
});

api.getAnticipatedGames().then(games => {
    games.forEach((game, idx) => {
        const carouselEntryInstance = carouselEntryTemplate.content.cloneNode(true);
        const carouselEntry = carouselEntryInstance.querySelector('.carousel-item');

        if (idx === 0) carouselEntry.classList.add('active');
        carouselEntry.querySelector('#card-link').href=`/game?id=${game.id}`;
        carouselEntry.querySelector('.card-img-top').src=game.image;
        carouselEntry.querySelector('.card-img-top').alt=`${game.name} cover photo`;
        comingSoonCarouselList.appendChild(carouselEntry);
    })

    carousel.activateCarousel();
});