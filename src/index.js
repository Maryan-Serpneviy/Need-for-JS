/* eslint-disable no-unused-vars */
const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');

const car = document.createElement('div');
car.classList.add('car');

const Key = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const Setting = {
    start: false,
    score: 0,
    speed: 3
};

const playGame = () => {
    if (Setting.start) {
        requestAnimationFrame(playGame);
    }
};

const startGame = () => {
    start.classList.add('hidden');
    Setting.start = true;
    gameArea.appendChild(car);
    requestAnimationFrame(playGame);
};

const startRun = evt => {
    evt.preventDefault();
    Key[evt.key] = true;
};

const stopRun = evt => {
    evt.preventDefault();
    Key[evt.key] = false;
};

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);