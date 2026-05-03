import api from './APIClient.js';

const query = globalThis.location.search;
const parameters = new URLSearchParams(query);
const profileId = parameters.get('id');

const carouselEntryTemplate = document.querySelector('#videogameLesserFeatureTemplate');
const carouselEmptyTemplate = document.querySelector('#UnselectedSlotTemplate');
const friendTemplate = document.querySelector('#friendTemplate');
const friendRequestTemplate = document.querySelector('#friendRequestTemplate');
const statusTemplate = document.querySelector('#statusTemplate');
const reviewTemplate = document.querySelector('#reviewTemplate');

const favoriteGamesList = document.querySelector('#fav-carousel-inner');
const friendsList = document.querySelector('.friends-list');
const friendRequestsList = document.querySelector('.friend-requests-list');
const settingsForm = document.querySelector('.settings-form');
const newUsername = document.querySelector('#usernameInput');
const addFriendBtn = document.querySelector('#add-friend-btn');
const settingsBtn = document.querySelector('#settings-btn');
const userStatusList = document.querySelector('#user-status-list');
const userReviewList = document.querySelector('#user-review-list');
const errorBox = document.querySelector('#settings-errorbox');

const renderStars = (score) =>  '★'.repeat(score) + '☆'.repeat(5 - score);

const renderStatus = (activity) => {
    const instance = statusTemplate.content.cloneNode(true);
    instance.querySelector('.status-game-name').textContent = activity.game.name;
    instance.querySelector('.status-game-link').href = `/gameauth?id=${activity.game.id}`;
    instance.querySelector('.status-action').textContent = activity.action;
    userStatusList.appendChild(instance);
};

const renderReview = (review) => {
    const instance = reviewTemplate.content.cloneNode(true);
    instance.querySelector('.review-game-name').textContent = review.game.name;
    instance.querySelector('.review-game-link').href = `/gameauth?id=${review.game.id}`;
    instance.querySelector('.review-score').textContent = renderStars(review.score);
    instance.querySelector('.review-message').value = review.message;
    instance.querySelector('.review-date').textContent = new Date(review.createdAt).toLocaleDateString();
    userReviewList.appendChild(instance);
};

let currentUser = null;

api.getCurrentUser().then(user => {
    currentUser = user;
    const targetId = Number.parseInt(profileId);
    const isOwnProfile = targetId === user.id;

    if (isOwnProfile) {
        settingsBtn.style.display = 'block';
        addFriendBtn.style.display = 'none';
        document.querySelector('.friends-list-title').style.display = 'block';
        document.querySelector('.friend-requests-list-title').style.display = 'block';

        return Promise.all([
            Promise.resolve(user),
            api.getUserFavoriteGames(user.id),
            api.getFriends(),
            api.getReviewsByUser(user.id),
            api.getFriendActivities([user.id])
        ]);
    } else {
        settingsBtn.style.display = 'none';
        addFriendBtn.style.display = 'block';
        document.querySelector('.friend-requests-list-title').style.display = 'none';
        friendRequestsList.style.display = 'none';

        // Use confirmFriend to check friendship status
        api.confirmFriend(profileId).then(response => {
            if (response.status) {
                addFriendBtn.textContent = 'Friends ✓';
                addFriendBtn.disabled = true;
                addFriendBtn.classList.replace('btn-outline-primary', 'btn-outline-success');
            }
        }).catch(err => console.log(err));

        return Promise.all([
            api.getUser(targetId),
            api.getUserFavoriteGames(targetId),
            api.getUserFriends(targetId),
            api.getReviewsByUser(targetId),
            api.getFriendActivities([targetId])
        ]);
    }

}).then(([profileUser, games, friendData, reviews, activities]) => {

    document.querySelector('#username').innerText = profileUser.username;
    document.querySelector('#name').innerText = `${profileUser.first_name} ${profileUser.last_name}`;

    const targetId = Number.parseInt(profileId);
    const isOwnProfile = targetId === currentUser.id;

    // Favorite games
    games.forEach((game) => {
        const carouselEntryInstance = carouselEntryTemplate.content.cloneNode(true);
        const carouselEntry = carouselEntryInstance.querySelector('.carousel-item');

        carouselEntry.querySelector('#card-link').href = `/gameauth?id=${game.id}`;
        carouselEntry.querySelector('.card-img-top').src = game.image;
        carouselEntry.querySelector('.card-img-top').alt = `${game.name} cover photo`;
        carouselEntry.querySelector('.card-title').innerText = game.name;

        const deleteButton = carouselEntry.querySelector('.btn');
        if (isOwnProfile) {
            deleteButton.addEventListener('click', e => {
                api.removeUserFavoriteGame(game.id).then(() => {
                    globalThis.location.reload();
                }).catch(err => console.log(err));
            });
        } else {
            deleteButton.remove();  // cleaner than hiding
        }

        favoriteGamesList.appendChild(carouselEntry);
    });

    for (let i = 0; i < 4 - games.length; i++) {
        const carouselEmptyInstance = carouselEmptyTemplate.content.cloneNode(true);
        const carouselEmpty = carouselEmptyInstance.querySelector('.carousel-item');
        favoriteGamesList.appendChild(carouselEmpty);
    }

    // Friends list
    if (friendData) {
        friendData.friends.forEach(async friendId => {
            const user = await api.getUser(friendId);
            const friendInstance = friendTemplate.content.cloneNode(true);
            const friend = friendInstance.querySelector('.friend');
            friend.querySelector('.friend-link').href = `/user?id=${user.id}`;
            friend.querySelector('.friend-name').innerText = user.username;

            const removeFriendButton = friend.querySelector('.friend-remove');
            if (isOwnProfile) {
                removeFriendButton.addEventListener('click', e => {
                    api.removeFriend(user.id).then(() => globalThis.location.reload())
                        .catch(err => console.log(err));
                });
            } else {
                removeFriendButton.remove();
            }

            friendsList.appendChild(friend);
        });

        // Friend requests (own profile only)
        if (isOwnProfile) {
            friendData.friendsRequests.forEach(async friendRequestId => {
                const user = await api.getUser(friendRequestId);
                const friendRequestInstance = friendRequestTemplate.content.cloneNode(true);
                const friendRequest = friendRequestInstance.querySelector('.friend-request');
                friendRequest.querySelector('.friend-request-link').href = `/user?id=${user.id}`;
                friendRequest.querySelector('.friend-request-name').innerText = user.username;

                friendRequest.querySelector('.friend-request-accept').addEventListener('click', e => {
                    api.addFriend(user.id).then(() => globalThis.location.reload())
                        .catch(err => console.log(err));
                });

                friendRequest.querySelector('.friend-request-reject').addEventListener('click', e => {
                    api.removeFriend(user.id).then(() => globalThis.location.reload())
                        .catch(err => console.log(err));
                });

                friendRequestsList.appendChild(friendRequest);
            });
        }
    }

    let ratings = [0, 0, 0, 0, 0];
    let reviewed = reviews.length;
    reviews.forEach(review => {
        ratings[review.score - 1]++;
    })

    for (let i = 0; i < ratings.length; i++) {
        document.getElementById(`${i + 1}-star`).textContent = `${i + 1} ★ - ${ratings[i]}`;
    }

    let gameStats = [0, 0, 0, 0]
    activities.forEach(activity => {
        if (activity.action === 'playing') { gameStats[0]++ }
        else if (activity.action === 'finished') { gameStats[1]++ }
        else { gameStats[2]++ }
    })

    document.getElementById('playing').textContent = `Playing: ${gameStats[0]} games`
    document.getElementById('finished').textContent = `Finished: ${gameStats[1]} games`
    document.getElementById('dropped').textContent = `Dropped: ${gameStats[2]} games`
    document.getElementById('reviewed').textContent = `Reviewed: ${reviewed} games`

    // Activity feed
    activities.slice(0, 3).forEach(a => renderStatus(a));
    reviews.slice(0, 3).forEach(r => renderReview(r));

}).catch(err => {
    console.log(err);
    if (err.status === 401) {
        globalThis.location.href = '/';
    } else {
        globalThis.location.href = '/auth';
    }
});

// Add friend button
addFriendBtn.addEventListener('click', e => {
    api.addFriend(profileId).then(() => {
        addFriendBtn.textContent = 'Friend Request Sent';
        addFriendBtn.disabled = true;
        addFriendBtn.classList.replace('btn-outline-primary', 'btn-outline-secondary');
    }).catch(err => console.log(err));
});

// Settings form
settingsForm.addEventListener('submit', e => {
    e.preventDefault();
    errorBox.classList.add('hidden');

    if (newUsername.value === '') {
        errorBox.classList.remove('hidden');
        errorBox.textContent = 'Error: No username entered.';
        return;
    }

    api.updateUser(newUsername.value).then(() => {
        api.logOut().then(() => {
            document.location = '/';
        });
    }).catch(err => {
        errorBox.classList.remove('hidden');
        errorBox.textContent = err.status === 409 ? 'Error: Username already taken' : 'Error: ' + err;
    });
});