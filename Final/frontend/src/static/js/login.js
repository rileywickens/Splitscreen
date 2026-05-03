import api from './APIClient.js';

const loginForm = document.querySelector('#sign-in-form');
const username = document.querySelector('#sign-in-username');
const password = document.querySelector('#sign-in-password');
const errorBox = document.querySelector('#sign-in-errorbox');

function showError(error) {
  errorBox.classList.remove("hidden");
  if(error.status === 401) {
    errorBox.textContent = "Invalid username or password";
  }
  else {
    errorBox.textContent = error;
  }
}

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  errorBox.classList.add("hidden");

  api.logIn(username.value, password.value).then(() => {
    document.location = "/auth";
    const myModal = new bootstrap.Modal('#signInModal');
    myModal.hide();
  }).catch((error) => {
    showError(error)
  });
});


