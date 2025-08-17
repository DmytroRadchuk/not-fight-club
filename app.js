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
const homeGameResultPanel = document.querySelector('.home-game-result-panel');
const roundButton = document.querySelector('.home-game-start-button');
const winScoreElement = document.getElementById('winScore');
const loseScoreElement = document.getElementById('loseScore');
const homeGameAttackButton = document.querySelector('.home-game-attack-buttons');
let resultTextElement = document.getElementById('resultText');

resultTextElement.textContent = '!';

let winScore = 0;
let loseScore = 0;



// writing starting status to local storage
if (!myStorage.getItem('gameStatus')) {
    myStorage.setItem('gameStatus', 'registering');
}


// function for render game screens

const hero = {
    name: myStorage.getItem('playerName'),
    class: 'warrior',
    maxHealth: 100,
    health: 100,
    attack: 20,
    avatar: './img/heroes/warrior.webp',
    defenseZone: []
}

const enemy = [
    {
        name: 'Spider',
        class: 'monster',
        maxHealth: 80,
        health: 80,
        attack: 15,
        avatar: './img/enemy/spyder.webp',
        defenseZone: ['head', 'body'],
        attackZones: ['head']
    },
    {
        name: 'Goblin',
        class: 'monster',
        maxHealth: 60,
        health: 60,
        attack: 30,
        avatar: './img/enemy/goblin.png',
        defenseZone: ['head', 'body'],
        attackZones: ['head']
    },
    {
        name: 'Ent',
        class: 'monster',
        maxHealth: 140,
        health: 140,
        attack: 10,
        avatar: './img/enemy/ent.png',
        defenseZone: ['head', 'body'],
        attackZones: ['head']
    },
        {
        name: 'Slime',
        class: 'monster',
        maxHealth: 80,
        health: 80,
        attack: 15,
        avatar: './img/enemy/slime.png',
        defenseZone: ['head', 'body'],
        attackZones: ['head']
    },
        {
        name: 'Dragon',
        class: 'monster',
        maxHealth: 150,
        health: 150,
        attack: 15,
        avatar: './img/enemy/dragon.webp',
        defenseZone: ['head', 'body'],
        attackZones: ['head']
    }
]

// rendom enemy
let numberForRendomEnemy = 1;

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

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTwoRandomElements(arr) {
  let copy = [...arr]; 
  let first = getRandomElement(copy);
  copy.splice(copy.indexOf(first), 1);
  let second = getRandomElement(copy);
  return [first, second];
}

function addToBattleLog(message) {
    const battleLog = document.getElementById('battleLog');
    const p = document.createElement('p');
    p.textContent = message;
    battleLog.appendChild(p);

    // автоматический скролл вниз
    battleLog.scrollTop = battleLog.scrollHeight;
}

function enemyTurn(enemy) {
    enemy.currentAttack = getRandomElement(['head', 'neck', 'body', 'belly', 'legs']);
    enemy.defenseZone = getTwoRandomElements(['head', 'neck', 'body', 'belly', 'legs']);

    addToBattleLog(`Враг атакует: ${enemy.currentAttack}`);
    addToBattleLog(`Враг защищается: ${enemy.defenseZone}`);
}

function startGame() {
    enemyCard.classList.add('visible');
    homeGameMenu.classList.add('unvisible');
    homeGameResultPanel.classList.add('unvisible');
    homeGamePlayground.classList.add('visible');
    numberForRendomEnemy = Math.floor(Math.random() * enemy.length);
    renderEnemy(enemy[numberForRendomEnemy]);

    hero.health = hero.maxHealth;
    hero.defenseZone = []; 

    enemy[numberForRendomEnemy].health = enemy[numberForRendomEnemy].maxHealth;
    // enemy[numberForRendomEnemy].defenseZone = [];
}

function endGame() {
    enemyCard.classList.remove('visible');
    homeGameMenu.classList.remove('unvisible');
    homeGameResultPanel.classList.remove('unvisible');
    homeGamePlayground.classList.remove('visible');
    hero.health = hero.maxHealth;
    hero.defenseZone = [];
    enemy[numberForRendomEnemy].health = enemy[numberForRendomEnemy].maxHealth;
    renderHero(hero); 
}

function gameRound(hero, enemy) {
    const heroAttack = document.querySelectorAll('input[name="attack"]');
    const heroDefense = document.querySelectorAll('input[name="defense"]');

    let heroAttackValue = '';
    hero.defenseZone = []; 

    heroAttack.forEach(attackButton =>{
        if (attackButton.checked) {
            heroAttackValue = attackButton.value;
        }
    });

    heroDefense.forEach(defenseButton =>{
        if (defenseButton.checked) {
            hero.defenseZone.push(defenseButton.value);
        }
    });

    enemyTurn(enemy);

    if (!enemy.defenseZone.includes(heroAttackValue)) {
        enemy.health -= hero.attack;
        addToBattleLog(`Герой попал! -${hero.attack} HP врагу`);
    } else {
        addToBattleLog("Враг защитился от удара героя!");
    }

    if (!hero.defenseZone.includes(enemy.currentAttack)) {
        hero.health -= enemy.attack;
        addToBattleLog(`Враг попал! -${enemy.attack} HP герою`);
    } else {
        addToBattleLog("Герой защитился от удара врага!");
    }

    renderEnemy(enemy);
    renderHero(hero);

    if (hero.health <= 0) {
        endGame()
        loseScore++;
        loseScoreElement.textContent = loseScore;
        resultTextElement.textContent = ' but you lose';
        alert("Вы проиграли! 🩸");
        document.getElementById('battleLog').innerHTML = "";
    } else if (enemy.health <= 0) {
        endGame()
        winScore++;
        resultTextElement.textContent = ' and you win';
        winScoreElement.textContent = winScore;
        alert(`Вы победили врага: ${enemy.name}! 🎉`);
        document.getElementById('battleLog').innerHTML = "";
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
    const heroAttack = document.querySelectorAll('input[name="attack"]');
    const heroDefense = document.querySelectorAll('input[name="defense"]');
    let attackButtonCounter = 0;
    let defenseButtonCounter = 0;

    heroAttack.forEach(item => {
        if (item.checked) {
            attackButtonCounter++;
        }
    });

    heroDefense.forEach(item => {
        if (item.checked) {
            defenseButtonCounter++;
        }
    });
    if(attackButtonCounter == 1 && defenseButtonCounter == 2) {
        roundButton.classList.remove('animate');
        gameRound(hero, enemy[numberForRendomEnemy]);
    } else {
        attackButtonCounter = 0;
        defenseButtonCounter = 0;
        roundButton.classList.add('animate');
        console.log('Выберите атаку и защиту!');
    }
});

// homeGameAttackButton.addEventListener('click', function(){
//     let activeButton = true;
//     const heroAttack = document.querySelectorAll('input[name="attack"]');
//     heroAttack.forEach(item => {
//         if (item.checked) {
//             activeButton = false;
//         } 
//     });
//     if(!activeButton){
//         heroAttack.forEach(item => {
//             item.disabled = true;
//         });
//     }
// });


startGameButton.addEventListener('click', startGame);
