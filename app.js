const myStorage = window.localStorage;




const registerScreen = document.querySelector('.register');
const joinGameButton = document.getElementById('joinGame');
const registerFormInput = document.getElementById('registerFormInput');

let gameStatus = "registering";

function renderGameWindow(status){
    if (status === 'registering') {
        registerScreen.classList.remove('animate');
    } else {
        registerScreen.classList.add('animate');
    }   
}

renderGameWindow(gameStatus);

joinGameButton.addEventListener('click', function(){
    myStorage.setItem('playerName', registerFormInput.value);
    gameStatus = 'gameMenu'
    renderGameWindow(gameStatus);
});