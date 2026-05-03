import api from './APIClient.js';


const carouselEntryTemplate = document.querySelector('#videogameLesserFeatureTemplate');
const carouselEmptyTemplate = document.querySelector('#UnselectedSlotTemplate');

const favoriteGamesList = document.querySelector('#fav-carousel-inner');
const friendsList = document.querySelector('.friends-list');
const friendRequestsList = document.querySelector('.friend-requests-list');
const settingsForm = document.querySelector('.settings-form');
const newUsername = document.querySelector('#usernameInput');

let id = null;

api.getCurrentUser().then(user => { 
    document.querySelector('#username').innerText = user.username;
    document.querySelector('#name').innerText = `${user.first_name} ${user.last_name}`;
    id = user.id;
    return api.getUserFavoriteGames(user.id);
}).then(games => {
    games.forEach((game, idx) => {
        const carouselEntryInstance = carouselEntryTemplate.content.cloneNode(true);
        const carouselEntry = carouselEntryInstance.querySelector('.carousel-item');

        carouselEntry.querySelector('#card-link').href=`/gameauth?id=${game.id}`;
        carouselEntry.querySelector('.card-img-top').src=game.image;
        carouselEntry.querySelector('.card-img-top').alt=`${game.name} cover photo`;
        carouselEntry.querySelector('.card-title').innerText = game.name;

        const deleteButton = carouselEntry.querySelector('.btn');
        deleteButton.addEventListener('click', e => {
            api.removeUserFavoriteGame(game.id).then(response => {
                console.log(`Remove Fav Game:  ${response.status}`)
                globalThis.location.reload();
            }).catch(err => {
                console.log(err);
            })
        });
        favoriteGamesList.appendChild(carouselEntry);
    });

    for (let i = 0; i < 4 - games.length; i++) {
        const carouselEmptyInstance = carouselEmptyTemplate.content.cloneNode(true);
        const carouselEmpty = carouselEmptyInstance.querySelector('.carousel-item');
        favoriteGamesList.appendChild(carouselEmpty);
    }

});

api.getFriends().then(response => {
    console.log(response);
    response.friends.forEach(async friendId => {
        const user = await api.getUser(friendId);
        const friendInstance = friendTemplate.content.cloneNode(true);
        const friend = friendInstance.querySelector('.friend');
        friend.querySelector('.friend-link').href = `/user?id=${user.id}`;
        friend.querySelector('.friend-name').innerText = user.username;

        const removeFriendButton = friend.querySelector('.friend-remove');
        removeFriendButton.addEventListener('click', e => {
            api.removeFriend(user.id).then(response => {
                console.log(`Friend Remove Status: ${response.status}`)
                globalThis.location.reload();
            }).catch(err => {
                console.log(err);
            });
        });

        friendsList.appendChild(friend);
    });

    response.friendsRequests.forEach(async friendRequestId => {
        const user = await api.getUser(friendRequestId);
        const friendRequestInstance = friendRequestTemplate.content.cloneNode(true);
        const friendRequest = friendRequestInstance.querySelector('.friend-request');
        friendRequest.querySelector('.friend-request-link').href = `/user?id=${user.id}`;
        friendRequest.querySelector('.friend-request-name').innerText = user.username;

        const acceptFriendButton = friendRequest.querySelector('.friend-request-accept');
        acceptFriendButton.addEventListener('click', e => {
            api.addFriend(user.id).then(response => {
                console.log(`Friend Added Status: ${response.status}`)
                globalThis.location.reload();
            }).catch(err => {
                console.log(err);
            });
        });

        const rejectFriendRequest = friendRequest.querySelector('.friend-request-reject');
        rejectFriendRequest.addEventListener('click', e => {
            api.removeFriend(user.id).then(response => {
                console.log(`Friend Removed Status: ${response.status}`)
                globalThis.location.reload();
            }).catch(err => {
                console.log(err);
            });
        });

        friendRequestsList.appendChild(friendRequest);
    });
}).catch(err => {
    console.log(err);
});

const errorBox = document.querySelector('#settings-errorbox');

function showError(error) {
  errorBox.classList.remove("hidden");
  if(error.status === 409) {
    errorBox.textContent = "Error: Username already taken";
  }
  else if (error.status === 400) {
    errorBox.textContent = 'Error: Missing information';
  }
  else {
    errorBox.textContent = error;
  }
}

settingsForm.addEventListener('submit', e => {
    e.preventDefault();
    errorBox.classList.add("hidden");

    if (newUsername.value === '') {
        errorBox.classList.remove('hidden');
        errorBox.textContent = "Error: No username entered.";
        return;
    }

    api.updateUser(newUsername.value).then(response => {
        api.logOut().then(() => {
            document.location = "/";
        });
    }).catch(err => {
        showError(error)
    })
})

