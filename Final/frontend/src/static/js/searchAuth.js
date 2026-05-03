import api from './APIClient.js';

const searchForm = document.querySelector('#search-bar');
const searchInput = document.querySelector('#search-input');

searchForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!searchInput.value) {
        alert('No Search Value Entered.');
    }
    else if (searchInput.value?.startsWith('#')) {
        gameSearch(searchInput.value.slice(1));
    }
    else if (searchInput.value?.startsWith('@')) {
        userSearch(searchInput.value.slice(1));
    }
    else {
        alert('Unrecognized Input.');
        searchInput.value = '';
    }

})

/* API limits the usage of game search since games cannot be requested by name and only by slug, this means games with slugs different from their
names are likely unsearchable by the user since they won't know what to search for, we can mitigate this where possible by first checking our
database but otherwise the user will have to get lucky or know the slug */
let gameSearch = async (search) => {
    api.getGameByName(search)
    .then(game => {
        console.log(game);
        globalThis.location.href = `/gameauth?id=${game.id}`;
    }).catch(err => {
        console.log(err);
        alert('Unable to find game.');
        searchInput.value = '';
    })
}

let userSearch = (search) => {
    api.searchUser(search)
    .then(user => {
        console.log(user.id);
        globalThis.location.href = `/user?id=${user.id}`;
    }).catch(err => {
        alert('Unable to find user.');
        searchInput.value = '';
    })
}