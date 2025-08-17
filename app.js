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

const modalWindow = document.querySelector('.modal');
const modalCloseButton = document.querySelector('.modal-close');
const modalSaveButton = document.getElementById('modalSave');
const gameSettingsButton = document.getElementById('gameSettings');

resultTextElement.textContent = '!';

let winScore = 0;
let loseScore = 0;
let logLine = 0;

function closeModalWindow() {
    const modal = document.querySelector('.modal');
    modal.classList.remove('open');
}

function openModalWindow() {
    const modal = document.querySelector('.modal');
    modal.classList.add('open');
}


// writing starting status to local storage
if (!myStorage.getItem('gameStatus')) {
    myStorage.setItem('gameStatus', 'registering');
}


// function for render game screens

const heroPull = [
    {
    name: myStorage.getItem('playerName'),
    class: 'warrior',
    maxHealth: 120,
    health: 120,
    attack: 20,
    critChance: 0.2,
    critMultiplier: 1.5,
    avatar: './img/heroes/warrior.webp',
    description: 'A brave warrior with high health and midle attack.',
    defenseZone: []
    },
    {
    name: myStorage.getItem('playerName'),
    class: 'mage',
    maxHealth: 70,
    health: 70,
    attack: 30,
    critChance: 0.15,
    critMultiplier: 1.8,
    avatar: './img/heroes/mage.jpg',
    description: 'A powerful mage with low health but high attack.',
    defenseZone: []
    },
    {
    name: myStorage.getItem('playerName'),
    class: 'archer',
    maxHealth: 90,
    health: 90,
    attack: 20,
    critChance: 0.33,
    critMultiplier: 2.1,
    avatar: './img/heroes/archer.webp',
    description: 'A skilled archer with midle health and high crit chance.',
    defenseZone: []
    }
]

function createHero(heroClass) {
    const baseHero = heroPull.find(hero => hero.class === heroClass);

      return {
    ...baseHero,   
    health: baseHero.maxHealth, 
    defenseZone: [] 
  };
}

let hero = createHero('warrior');

const enemy = [
    {
        name: 'Spider',
        class: 'monster',
        maxHealth: 80,
        health: 60,
        attack: 30,
        critChance: 0.2,
        critMultiplier: 1.5,
        avatar: './img/enemy/spyder.webp',
        description: 'A creepy spider with low health and high attack.',
        defenseZone: [],
        attackZones: []
    },
    {
        name: 'Goblin',
        class: 'monster',
        maxHealth: 60,
        health: 60,
        attack: 30,
        critChance: 0.36,
        critMultiplier: 1.5,
        avatar: './img/enemy/goblin.jpg',
        description: 'A sneaky goblin with low health and high critical chance.',
        defenseZone: [],
        attackZones: []
    },
    {
        name: 'Ent',
        class: 'monster',
        maxHealth: 140,
        health: 140,
        attack: 10,
        critChance: 0.2,
        critMultiplier: 1.5,
        avatar: './img/enemy/ent.webp',
        description: 'A giant tree monster with high health and low attack.',
        defenseZone: [],
        attackZones: []
    },
        {
        name: 'Slime',
        class: 'monster',
        maxHealth: 80,
        health: 80,
        attack: 15,
        critChance: 0.2,
        critMultiplier: 1.5,
        avatar: './img/enemy/slime.jpg',
        description: 'A gelatinous slime with low health and moderate attack.',
        defenseZone: [],
        attackZones: []
    },
        {
        name: 'Dragon',
        class: 'monster',
        maxHealth: 150,
        health: 150,
        attack: 25,
        critChance: 0.2,
        critMultiplier: 1.5,
        avatar: './img/enemy/dragon.webp',
        description: 'A fearsome dragon with high health and low attack.',
        defenseZone: [],
        attackZones: []
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
        <p class="home-hero-descr">${heroData.description}</p>
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
        <p class="home-enemy-descr">${enemyData.description}</span> buy one turn</p>
    `
}

function calculateDamage(attacker) {
  let damage = attacker.attack;

  // случайное число от 0 до 1
  if (Math.random() < attacker.critChance) {
    damage = Math.floor(damage * attacker.critMultiplier);
    addToBattleLog(`${attacker.name} наносит КРИТИЧЕСКИЙ удар на ${damage} урона!`);
  } else {
    addToBattleLog(`${attacker.name} наносит обычный удар на ${damage} урона.`);
  }

  return damage;
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

    // Чередование фона
    if (logLine % 2 === 0) {
        p.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
    } else {
        p.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    }
    logLine++;

    // Цвета для разных сообщений
    if (message.includes("КРИТИЧЕСКИЙ")) {
        p.style.color = "orange";
        p.style.fontWeight = "bold";
    } else if (message.includes(hero.name)) {
        p.style.color = "lightgreen";
    } else if (message.includes("Враг") || message.includes("враг")) {
        p.style.color = "red";
    } else if (message.includes("защитился")) {
        p.style.color = "gray";
        p.style.fontStyle = "italic";
    } else if (message.includes("погиб")) {
        p.style.color = "darkred";
        p.style.fontWeight = "bold";
    } else {
        p.style.color = "white"; // дефолтный цвет
    }

    p.style.padding = "2px 6px"; // немного отступа, чтобы аккуратнее смотрелось
    p.style.margin = "0";

    battleLog.appendChild(p);

    // автоскролл вниз
    battleLog.scrollTop = battleLog.scrollHeight;
}

function enemyTurn(enemy) {
    enemy.currentAttack = getRandomElement(['head', 'neck', 'body', 'belly', 'legs']);
    enemy.defenseZone = getTwoRandomElements(['head', 'neck', 'body', 'belly', 'legs']);
}

function attack(attacker, defender) {
  const damage = calculateDamage(attacker);

  defender.health -= damage;
  addToBattleLog(`${defender.name} теперь имеет ${defender.health} HP`);
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
        attack(hero, enemy);
    } else {
        addToBattleLog("Враг защитился от удара героя!");
    }

    if (!hero.defenseZone.includes(enemy.currentAttack)) {
        attack(enemy, hero);
        if (hero.health <= 0) {
            addToBattleLog("Герой погиб!");
        } else {
            addToBattleLog("Герой получил урон от врага!");
        }
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

gameSettingsButton.addEventListener('click', openModalWindow);

modalWindow.addEventListener('click', function(event) {
    if (event.target === modalWindow) {
        closeModalWindow();
    }
});
modalCloseButton.addEventListener('click', function() {
    closeModalWindow();
});
modalSaveButton.addEventListener('click', function() {
    const characterNameInput = document.getElementById('characterName');
    const heroType = document.querySelectorAll('input[name="hero"]');
    let currentHeroType = 'warrior';
    console.log(heroType);
    if(characterNameInput.value !== '' && characterNameInput.value !== null && characterNameInput.value.length >= 3){
        myStorage.setItem('playerName', characterNameInput.value);
        homepageHeronameOnTitle.textContent = myStorage.getItem('playerName');
        renderHero(hero);
        setTimeout(function(){
            characterNameInput.value = '';
        }, 1000);
    }
    heroType.forEach(item => {
        if(item.checked) {
            currentHeroType = item.value;
        }
    });
    hero = createHero(currentHeroType);
    renderHero(hero);
    closeModalWindow();
});




startGameButton.addEventListener('click', startGame);
