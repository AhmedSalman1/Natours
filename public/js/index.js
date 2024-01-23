/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './leaflet';
import { login, logout, signup, forgotPassword, resetPassword } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

//* DOM ELEMENTS
const leaflet = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDAtaForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

const forgotPasswordForm = document.querySelector('.form--forgotPassword');
const resetPasswordForm = document.querySelector('.form--resetPassword');

//* DELEGATION
if (leaflet) {
    const locations = JSON.parse(leaflet.dataset.locations);
    displayMap(locations);
}

if (signupForm)
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('passwordConfirm').value;

        signup(name, email, password, passwordConfirm);
    });

if (loginForm)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDAtaForm)
    userDAtaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log(form);

        updateSettings(form, 'data');
    });

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        document.querySelector('.btn--save-password').textContent =
            'Updating...';

        const passwordCurrent =
            document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('password-confirm').value;
        await updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password',
        );

        document.querySelector('.btn--save-password').textContent =
            'Save Password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });

if (bookBtn)
    bookBtn.addEventListener('click', (e) => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });

if (forgotPasswordForm)
    addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        forgotPassword(email);
    });

if (resetPasswordForm)
    addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('passwordConfirm').value;
        const token = window.location.pathname.split('/').pop();
        resetPassword(password, passwordConfirm, token);
    });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
