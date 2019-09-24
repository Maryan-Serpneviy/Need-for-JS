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
    speed: 3,
    traffic: 3
};

const getLinesAmount = lineHeight => document.documentElement.clientHeight / lineHeight + 1;

const moveRoad = () => {
    const roadLines = document.querySelectorAll('.road-line');
    roadLines.forEach(line => {
        line.y += Setting.speed;
        line.style.top = `${line.y}px`;

        if (line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
    });
};

const moveOpponent = () => {
    const opponents = document.querySelectorAll('.opponent');
    opponents.forEach(opponent => {
        opponent.y += Setting.speed / 2; // move multiplier
        opponent.style.top = opponent.y + 'px';
        if (opponent.y >= document.documentElement.clientHeight) {
            opponent.y = -100 * Setting.traffic;
            opponent.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50) /* car width */) + 'px';
            // -100 === car height. must be
        }
    });
};

const playGame = () => {
    if (Setting.start) {
        moveRoad();
        moveOpponent();
        if (Key.ArrowLeft && Setting.x > -40) {
            Setting.x -= Setting.speed;
        }

        if (Key.ArrowRight && Setting.x < gameArea.offsetWidth - car.offsetWidth + 40) {
            Setting.x += Setting.speed;
        }

        if (Key.ArrowUp && Setting.y > 50) {
            Setting.y -= Setting.speed;
        }

        if (Key.ArrowDown && Setting.y < gameArea.offsetHeight - car.offsetHeight - 50) {
            Setting.y += Setting.speed;
        }

        car.style.left = `${Setting.x}px`;
        car.style.top = `${Setting.y}px`

        requestAnimationFrame(playGame);
    }
};

const startGame = () => {
    start.classList.add('hidden');
    gameArea.classList.remove('hidden');

    for (let i = 0; i < getLinesAmount(100); i++) {
        const roadLine = document.createElement('div');
        roadLine.classList.add('road-line');
        roadLine.style.top = i * 100 + 'px';//`${i * 100}px`;
        roadLine.y = i * 100;
        gameArea.appendChild(roadLine);
    }

    for (let i = 0; i < getLinesAmount(100 * Setting.traffic); i++)  {
        const opponent = document.createElement('div');
        opponent.classList.add('opponent');
        // 100 - car height ??
        opponent.y = -100 * Setting.traffic * (i + 1);
        opponent.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50) /* car width */) + 'px';
        opponent.style.top = opponent.y + 'px';
        //opponent.style.background = url
        gameArea.appendChild(opponent);
    }

    Setting.start = true;
    gameArea.appendChild(car);
    Setting.x = car.offsetLeft;
    Setting.y = car.offsetTop;
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