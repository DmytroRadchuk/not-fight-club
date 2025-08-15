const myStorage = window.localStorage;

const registerScreen = document.querySelector('.register');
const homeScreen = document.querySelector('.home');
const joinGameButton = document.getElementById('joinGame');
const registerFormInput = document.getElementById('registerFormInput');
const logoutButton = document.getElementById('logoutButton');
const homepageHeronameOnTitle = document.getElementById('playerName');
const startGameButton = document.getElementById('startGame');
const enemyCard = document.querySelector('.home-enemy-card');
const homeGameMenu = document.querySelector('.home-game-menu');
const homeGamePlayground = document.querySelector('.home-game-playground');


// writing starting status to local storage
if (!myStorage.getItem('gameStatus')) {
    myStorage.setItem('gameStatus', 'registering');
}


// function for render game screens

const hero = {
    name: myStorage.getItem('playerName'),
    class: 'warrior',
    health: 100,
    avatar: './img/heroes/warrior.webp'
}


function renderGameWindow(status){
    if (status === 'registering') {
        registerScreen.classList.remove('animate');
    } else {
        registerScreen.classList.add('animate');
    }
    if (status === 'gameMenu') {
        homeScreen.classList.remove('animate');
        homepageHeronameOnTitle.textContent = myStorage.getItem('playerName');
        renderHero(hero);
    } else {
        homeScreen.classList.add('animate');
    }  
}

function renderHero(heroData) {
    heroData.name = myStorage.getItem('playerName');
    const heroCard = document.querySelector('.home-hero-card');
    heroCard.innerHTML = `
        <div class="home-hero-img-box">
            <img src="${heroData.avatar}" alt="${heroData.class}" class="hero-avatar">
        </div>
        <h2 class="home-hero-name">${heroData.name}</h2>
        <p class="home-hero-health">Health: <span>${heroData.health}</span></p>
    `
}

function startGame() {
    enemyCard.classList.add('visible');
    homeGameMenu.classList.add('unvisible');
    homeGamePlayground.classList.add('visible');
}

// startGame();
function endGame() {
    enemyCard.classList.remove('visible');
    homeGameMenu.classList.remove('unvisible');
    homeGamePlayground.classList.remove('visible');
}

renderGameWindow(myStorage.getItem('gameStatus'));



// button event listeners
logoutButton.addEventListener('click', function(){
    myStorage.setItem('gameStatus', 'registering');
    renderGameWindow(myStorage.getItem('gameStatus'));
    myStorage.setItem('playerName', null);
    endGame();
});
joinGameButton.addEventListener('click', function(){
    if(registerFormInput.value !== '' && registerFormInput.value !== null && registerFormInput.value.length >= 3){
        myStorage.setItem('playerName', registerFormInput.value);
        myStorage.setItem('gameStatus', 'gameMenu');
        setTimeout(function(){
            registerFormInput.value = '';
        }, 1000);
        renderGameWindow(myStorage.getItem('gameStatus'));
    }
});


startGameButton.addEventListener('click', startGame);