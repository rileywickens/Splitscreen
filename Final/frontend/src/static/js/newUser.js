import api from './APIClient.js';

const createUserForm = document.querySelector('#create-account-form');
const username = document.querySelector('#sign-up-username');
const password = document.querySelector('#sign-up-password');
const confirmPassword = document.querySelector('#sign-up-confirm-password');
const firstName = document.querySelector('#sign-up-first-name');
const lastName = document.querySelector('#sign-up-last-name');

const errorBox = document.querySelector('#create-account-errorbox');

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

createUserForm.addEventListener('submit', e => {
  e.preventDefault();
  errorBox.classList.add("hidden");

  if (password.value !== confirmPassword.value) {
    errorBox.classList.remove('hidden');
    errorBox.textContent = "Error: Passwords do not match";
    return;
  }

  api.createUser(firstName.value, lastName.value, username.value, password.value).then(userData => {
    document.location = "/auth";
    const myModal = new bootstrap.Modal('#signUpModal');
    myModal.hide();
  }).catch((error) => {
    showError(error)
  });
});


