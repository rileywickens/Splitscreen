import api from './APIClient.js';

function displayUserInHeader(user) {
  let profileLink = document.createElement('a');
  profileLink.href = `/user?id=${user.id}`;
  profileLink.innerHTML = user.username;
  profileLink.className = "btn btn-sm btn-outline-secondary"

  let logoutLink = document.createElement('a');
  logoutLink.href = '/';
  logoutLink.innerHTML = "Log Out";
  logoutLink.className = "btn btn-sm btn-outline-secondary"
  logoutLink.addEventListener("click", e => {
    e.preventDefault();
    logOut();
  })

  const buttonContainer = document.getElementById('nav-buttons');
  buttonContainer.appendChild(profileLink);
  buttonContainer.appendChild(logoutLink);
}

function logOut() {
  api.logOut().then(() => {
    document.location = "/";
  });
}

api.getCurrentUser().then(user => { 
  if (user) {
      displayUserInHeader(user);
  }
})
.catch(error => {
    console.log(`${error.status}`, error);
});