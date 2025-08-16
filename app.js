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
const roundButton = document.querySelector('.home-game-attack-button');


// writing starting status to local storage
if (!myStorage.getItem('gameStatus')) {
    myStorage.setItem('gameStatus', 'registering');
}


// function for render game screens

const hero = {
    name: myStorage.getItem('playerName'),
    class: 'warrior',
    health: 100,
    attack: 20,
    avatar: './img/heroes/warrior.webp',
    defenseZone: []
}

const enemy = {
    name: 'Spider',
    class: 'monster',
    health: 80,
    attack: 15,
    avatar: './img/enemy/spyder.webp',
    defenseZone: ['head', 'body'],
    attackZones: ['head']
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

function renderEnemy(enemyData) {
    const enemyCard = document.querySelector('.home-enemy-card');
    enemyCard.innerHTML = `
        <div class="home-enemy-img-box">
            <img src="${enemyData.avatar}" alt="${enemyData.class}" class="enemy-avatar">
        </div>
        <h2 class="home-enemy-name">${enemyData.name}</h2>
        <p class="home-enemy-health">Health: <span>${enemyData.health}</span></p>
        <p class="home-enemy-descr">Has small HP, but can attack <span>two zones</span> buy one turn</p>
    `
}

function startGame() {
    enemyCard.classList.add('visible');
    homeGameMenu.classList.add('unvisible');
    homeGamePlayground.classList.add('visible');
    renderEnemy(enemy);
}

// startGame();
function endGame() {
    enemyCard.classList.remove('visible');
    homeGameMenu.classList.remove('unvisible');
    homeGamePlayground.classList.remove('visible');
}

function gameRound(hero, enemy){
    const heroAttack = document.querySelectorAll('input[name="attack"]');
    const heroDefense = document.querySelectorAll('input[name="defense"]');
    let heroAttackValue = '';
    let heroPunch = true;
    let enemyPunch = true;

    heroAttack.forEach(attackButton =>{
        if(attackButton.checked){
            heroAttackValue = attackButton.value;
        }
    })

    heroDefense.forEach(defenseButton =>{
        if(defenseButton.checked){
            hero.defenseZone.push(defenseButton.value);
        }
    })

    enemy.defenseZone.forEach(defenseZone => {
        console.log(defenseZone);
        if (heroAttackValue === defenseZone) {
            heroPunch = false;
        }
    });

    hero.defenseZone.forEach(defenseZone => {
        enemy.attackZones.forEach(attackZone => {
            if (defenseZone === attackZone) {
                enemyPunch = false;
            }
        });
    });

    if (heroPunch) {
        enemy.health -= hero.attack;
    }

    if (enemyPunch) {
        hero.health -= enemy.attack;
    }
    renderEnemy(enemy);
    renderHero(hero);

    if(hero.health <= 0 || enemy.health <= 0) {
        endGame();
    }
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

roundButton.addEventListener('click', function(){
    gameRound(hero, enemy);
});

startGameButton.addEventListener('click', startGame);
