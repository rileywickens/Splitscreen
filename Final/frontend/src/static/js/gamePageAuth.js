import api from './APIClient.js';

/**
 * Review, Others' reviews, Activity, and Favorite functionality all go here
 */

const query = globalThis.location.search;
let parameters = new URLSearchParams(query);
const id = parameters.get('id');

const favoriteGame = document.querySelector('#checkboxFavorite');
const gameStatus = document.querySelectorAll('input[name="radioStatus"]');
const reviewForm = document.querySelector('#review-form'); 
const reviewMessage = document.querySelector('#review-message');
const reviewTimestamp = document.querySelector('#review-timestamp');

let currentUser = null;
let currentReviewId = null;

api.getCurrentUser().then(user => {
    currentUser = user;
    return Promise.all([
        api.getUserFavoriteGames(user.id),
        api.getUserGameStatus(user.id, id),
        api.getUserReviewForGame(user.id, id)
    ]);
}).then(([games, { status }, review]) => {
    console.log('review:', JSON.stringify(review));
    // Handle favorites
    for (let game of games) {
        if (game.id === Number.parseInt(id)) {
            favoriteGame.checked = true;
        }
    }
    // Handle status
    if (status) {
        const radio = document.querySelector(`input[name="radioStatus"][value="${status}"]`);
        if (radio) radio.checked = true;
    }

    // Handle existing review
    if (review) {
        console.log(review.id);
        currentReviewId = review.id;
        const star = document.querySelector(`input[name="starRating"][value="${review.score}"]`);
        if (star) star.checked = true;
        reviewMessage.value = review.message;

        const date = review.updatedAt || review.createdAt;
        const label = review.updatedAt ? 'Updated' : 'Created';
        reviewTimestamp.textContent = `${label}: ${new Date(date).toLocaleString()}`;
        reviewTimestamp.style.display = 'block';
    }
}).catch(err => console.log(err))

favoriteGame.addEventListener('change', e => {
    e.preventDefault();
    if (favoriteGame.checked) {
        api.addUserFavoriteGame(id).then(response => {
            if (response.status) {
                console.log("Game Favorited");
            } else {
                alert('Favorite Game Limit Reached.\nPlease visit your profile to remove a favorite');
                favoriteGame.checked = false;
            }
        }).catch(err => console.log(err));
    } else {
        api.removeUserFavoriteGame(id).then(response => {
            console.log(`Remove Fav Game:  ${response.status}`)
        }).catch(err => console.log(err));
    }
});

gameStatus.forEach(radio => {
    radio.addEventListener('change', e => {
        e.preventDefault();
        if (!currentUser) return;
        const selectedStatus = e.target.value;
        api.setUserGameStatus(currentUser.id, id, selectedStatus)
            .then(() => console.log(`Status updated to: ${selectedStatus}`))
            .catch(err => console.log(err));
    });
});

reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!currentUser) return;

    const selectedStar = document.querySelector('input[name="starRating"]:checked');
    if (!selectedStar) return;

    const score = parseInt(selectedStar.value); 
    const message = reviewMessage.value;

    if (currentReviewId) {
        // Update existing review
        api.updateReview(currentReviewId, currentUser.id, score, message)
            .then(() => {
                reviewTimestamp.textContent = `Updated: ${new Date().toLocaleString()}`;
                reviewTimestamp.style.display = 'block';
                globalThis.location.reload();
            }).catch(err => console.log(err));
    } else {
        // Create new review
        api.submitReview(currentUser.id, id, score, message)
            .then(response => {
                currentReviewId = response.id;
                reviewTimestamp.textContent = `Created: ${new Date().toLocaleString()}`;
                reviewTimestamp.style.display = 'block';
                globalThis.location.reload();
            }).catch(err => console.log(err));
    }
});

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

// Feed — runs after currentUser is set
api.getCurrentUser().then(user => {
    return Promise.all([
        api.getUserFriends(user.id),
        api.getReviewsByGame(id),
    ]);
}).then(([{ friends: friendIds }, gameReviews]) => {
    return Promise.all([
        Promise.resolve(friendIds),
        Promise.resolve(gameReviews),
        api.getFriendActivities(friendIds)  // now passing friend IDs
    ]);
}).then(([friendIds, gameReviews, allActivities]) => {
    const friendStatuses = allActivities
        .filter(a => a.game.id === Number.parseInt(id))
        .slice(0, 3);

    const friendReviews = gameReviews
        .filter(r => friendIds.some(fid => Number(fid) === r.user.id))
        .slice(0, 3);

    const otherReviews = gameReviews
        .filter(r => !friendIds.some(fid => Number(fid) === r.user.id))
        .slice(0, 3);

    friendStatuses.forEach(a => renderStatus(a, friendStatusList));
    friendReviews.forEach(r => renderReview(r, friendReviewList));
    otherReviews.forEach(r => renderReview(r, otherReviewList));

}).catch(err => console.log(err));