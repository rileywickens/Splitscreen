
/*
Home page friends activity functionality goes here!
*/

import api from './APIClient.js';
import carousel from './carousel.js';

const recentlyReleasedCarouselList = document.querySelector('#rr-carousel-inner');
const comingSoonCarouselList = document.querySelector('#cs-carousel-inner');
const featuredGame = document.querySelector('.featured-game');

const carouselEntryTemplate = document.querySelector('#videogameLesserFeatureTemplate');

const friendStatusList = document.querySelector('#friend-status-list');
const friendReviewList = document.querySelector('#friend-review-list');
const otherReviewList = document.querySelector('#other-review-list');
const statusTemplate = document.querySelector('#statusTemplate');
const reviewTemplate = document.querySelector('#reviewTemplate');

const renderStars = (score) =>  '★'.repeat(score) + '☆'.repeat(5 - score);

const renderStatus = (activity, container) => {
    const instance = statusTemplate.content.cloneNode(true);
    instance.querySelector('.status-username').textContent = activity.user.username;
    instance.querySelector('.status-user-link').href = `/user?id=${activity.user.id}`;
    instance.querySelector('.status-game-name').textContent = activity.game.name;
    instance.querySelector('.status-game-link').href = `/gameauth?id=${activity.game.id}`;
    instance.querySelector('.status-action').textContent = activity.action;
    container.appendChild(instance);
};

const renderReview = (review, container) => {
    const instance = reviewTemplate.content.cloneNode(true);
    instance.querySelector('.review-username').textContent = review.user.username;
    instance.querySelector('.review-user-link').href = `/user?id=${review.user.id}`;
    instance.querySelector('.review-game-name').textContent = review.game.name;
    instance.querySelector('.review-game-link').href = `/gameauth?id=${review.game.id}`;
    instance.querySelector('.review-score').textContent = renderStars(review.score);
    instance.querySelector('.review-message').value = review.message;
    instance.querySelector('.review-date').textContent = new Date(review.createdAt).toLocaleDateString();
    container.appendChild(instance);
};

api.getFeaturedGame().then(game => {
    featuredGame.querySelector('#featured-game-link').href=`/gameauth?id=${game.id}`;
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
        carouselEntry.querySelector('#card-link').href=`/gameauth?id=${game.id}`;
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
        carouselEntry.querySelector('#card-link').href=`/gameauth?id=${game.id}`;
        carouselEntry.querySelector('.card-img-top').src=game.image;
        carouselEntry.querySelector('.card-img-top').alt=`${game.name} cover photo`;

        comingSoonCarouselList.appendChild(carouselEntry);
    })

    carousel.activateCarousel();
});

api.getCurrentUser().then(user => {
    return Promise.all([
        api.getUserFriends(user.id),
        api.getAllReviews(),
    ]);
}).then(([friendIds, allReviews]) => {
    return Promise.all([
        Promise.resolve(friendIds),
        Promise.resolve(allReviews),
        api.getFriendActivities(friendIds.friends)  // pass friend IDs instead of userId
    ]);
}).then(([friendIds, allReviews, allActivities]) => {

    // Friend statuses (cap at 3)
    const friendStatuses = allActivities
        .slice(0, 3);

    // Friend reviews (cap at 3)
    const friendReviews = allReviews
        .filter(r => friendIds.friends.some(fid => Number(fid) === r.user.id))
        .slice(0, 3);

    // Other reviews — exclude friends (cap at 3)
    const otherReviews = allReviews
        .filter(r => !friendIds.friends.some(fid => Number(fid) === r.user.id))
        .slice(0, 3);

    friendStatuses.forEach(a => renderStatus(a, friendStatusList));
    friendReviews.forEach(r => renderReview(r, friendReviewList));
    otherReviews.forEach(r => renderReview(r, otherReviewList));

}).catch(err => console.log(err));