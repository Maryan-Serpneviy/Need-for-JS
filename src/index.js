/* eslint-disable no-unused-vars */
const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const player = document.createElement('div');

const PLAYER_CARS = 4;
const FAST_CARS = 4;
const SLOW_CARS = 5;
const TRACKS = 5;

const CAR_HEIGHT = 100;
const LINE_LENGTH = 100;
const LINE_GAP = 100;
const ROAD_OVERFLOW = 75;
const ROAD_PADDING_X = 5;
const ROAD_PADDING_Y = 50;

const CONTROLS_SENSITIVITY = 2.25;
const OPPONENT_SPEED = 2;

const Key = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const Setting = {
    start: false,
    score: 0,
    speed: 15,
    traffic: 4,
    trafficInterval: 100
};

const getLinesAmount = lineHeight => Math.ceil(gameArea.offsetHeight / lineHeight) + 1;

(() => {
    player.classList.add('car');
    player.classList.add('player');
    const playerCar = Math.floor(Math.random() * PLAYER_CARS) + 1;
    player.style.background = `transparent url('./assets/img/player/${playerCar}.png') center no-repeat`;
})();

const playMusic = () => {
    const music = document.createElement('audio');
    const track = Math.floor(Math.random() * TRACKS) + 1;
    music.classList.add('music');
    music.setAttribute('type', 'audio/mp3');
    music.setAttribute('autoplay', true);
    music.setAttribute('src', `./assets/music/${track}.mp3`);
    document.body.appendChild(music);
};

const moveRoad = () => {
    const roadLines = document.querySelectorAll('.road-line');
    roadLines.forEach(line => {
        line.y += Setting.speed;
        line.style.top = `${line.y}px`;
        if (line.y >= document.documentElement.clientHeight) {
            line.y = -LINE_LENGTH;
        }
    });
};

const moveOpponent = () => {
    const opponents = document.querySelectorAll('.opponent');
    opponents.forEach(opponent => {
        const playerRect = player.getBoundingClientRect();
        const opponentRect = opponent.getBoundingClientRect();

        if (playerRect.top <= opponentRect.bottom &&
            playerRect.right >= opponentRect.left &&
            playerRect.left <= opponentRect.right &&
            playerRect.bottom >= opponentRect.top) {
                Setting.start = false;
                start.classList.remove('hidden');
                start.style.top = score.offsetHeight;
        }

        opponent.y += Setting.speed / OPPONENT_SPEED;
        opponent.style.top = `${opponent.y}px`;
        if (opponent.y >= gameArea.offsetHeight) {
            opponent.y = -CAR_HEIGHT * OPPONENT_SPEED * Setting.traffic;
            opponent.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - ROAD_OVERFLOW))}px`;
        }
    });
};

const randomOpponent = () => {
    return Math.floor(Math.random() * FAST_CARS) + 1;
};

const playGame = () => {
    if (Setting.start) {
        Setting.score += Setting.speed;
        score.innerHTML = 'Score<br>' + Setting.score;
        moveRoad();
        moveOpponent();
        if (Key.ArrowLeft && Setting.x > ROAD_PADDING_X) {
            Setting.x -= Setting.speed / CONTROLS_SENSITIVITY;
        }

        if (Key.ArrowRight && Setting.x < gameArea.offsetWidth - player.offsetWidth - ROAD_PADDING_X) {
            Setting.x += Setting.speed / CONTROLS_SENSITIVITY;
        }

        if (Key.ArrowUp && Setting.y > ROAD_PADDING_Y) {
            Setting.y -= Setting.speed / CONTROLS_SENSITIVITY;
        }

        if (Key.ArrowDown && Setting.y < gameArea.offsetHeight - player.offsetHeight - ROAD_PADDING_Y) {
            Setting.y += Setting.speed / CONTROLS_SENSITIVITY;
        }

        player.style.left = `${Setting.x}px`;
        player.style.top = `${Setting.y}px`

        requestAnimationFrame(playGame);
    }
};

const startGame = () => {
    playMusic();
    start.classList.add('hidden');
    gameArea.classList.remove('hidden');
    gameArea.innerHTML = '';

    for (let i = 0; i < getLinesAmount(LINE_LENGTH) + 1; i++) {
        const roadLine = document.createElement('div');
        roadLine.classList.add('road-line');
        roadLine.style.top = `${i * 200}px`;
        roadLine.y = i * LINE_GAP;
        gameArea.appendChild(roadLine);
    }

    for (let i = 0; i < getLinesAmount(Setting.trafficInterval * Setting.traffic); i++) {
        const opponent = document.createElement('div');
        opponent.style.display = 'block';
        opponent.classList.add('car');
        opponent.classList.add('opponent');
        opponent.y = -CAR_HEIGHT * Setting.traffic * (i + 1);
        opponent.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - ROAD_OVERFLOW))}px`;
        opponent.style.top = `${opponent.y}px`;
        const opponentCar = Math.floor(Math.random() * FAST_CARS) + 1;
        opponent.style.background = `transparent url('./assets/img/traffic/fast/${opponentCar}.png') center no-repeat`;
        gameArea.appendChild(opponent);
    }

    Setting.score = 0;
    Setting.start = true;
    gameArea.appendChild(player);

    player.style.left = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
    player.style.top = 'auto';
    player.style.bottom = '10px';
    
    Setting.x = player.offsetLeft;
    Setting.y = player.offsetTop;

    requestAnimationFrame(playGame);
};

const startRun = evt => {
    evt.preventDefault();
    if (Key.hasOwnProperty(evt.key)) {
        Key[evt.key] = true;
    }
};

const stopRun = evt => {
    evt.preventDefault();
    if (Key.hasOwnProperty(evt.key)) {
        Key[evt.key] = false;
    }
};

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);