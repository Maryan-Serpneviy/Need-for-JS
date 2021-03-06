/* eslint-disable no-unused-vars */
const intro = document.querySelector('.intro');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.game-area');
const player = document.createElement('div');
player.classList.add('car');
player.classList.add('player');

const hud = document.querySelector('.game-area__hud');
const life = hud.querySelector('.hud__life');
const score = hud.querySelector('.hud__score');
const timer = hud.querySelector('.hud__timer');
hud.style.visibility = 'hidden';

const PLAYER_CARS = 5;
const TRAFFIC_CARS = 8;
const MUSIC_TRACKS = 5;

const CAR_HEIGHT = 100;
const LINE_LENGTH = 100;
const LINE_GAP = 100;
const ROAD_OVERFLOW = 75;
const ROAD_PADDING_X = 5;
const ROAD_PADDING_Y = 50;
const COLLISION_X = 5;
const COLLISION_Y = 15;

const OPPONENT_SPEED = 2;

const Key = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
    w: false,
    s: false,
    d: false,
    a: false
};

const Setting = {
    start: false,
    score: 0,
    speed: 15,
    traffic: 4,
    trafficInterval: 100,
    handling: 2.25
};


const music = new Audio('');
const track = Math.ceil(Math.random() * MUSIC_TRACKS);
music.src = `./assets/music/${track}.mp3`;
music.addEventListener('loadeddata', () => { /**/ });

window.addEventListener('DOMContentLoaded', () => {
    const jsLogo = document.querySelector('.logo__js');
    const introTap = document.querySelector('.intro__tap');
    const introLoading = document.querySelector('.intro__loading');

    const points = () => {
        let pointsCount = 0;
        return () => {
            if (pointsCount < 3) {
                const point = document.createElement('span');
                point.classList.add('loading-point');
                point.textContent = '.';
                introLoading.appendChild(point);
                pointsCount++;
            } else {
                introLoading.classList.add('hidden');
                jsLogo.classList.remove('hidden');
                setTimeout(() => {
                    introTap.classList.remove('hidden');
                    intro.addEventListener('click', setDifficulty);
                    intro.addEventListener('keydown', setDifficulty);
                }, 1000);
                return;
            }
        };
    };
    setInterval(points(), 750);
    clearInterval(points);
});

const getLinesAmount = lineHeight => Math.ceil(gameArea.offsetHeight / lineHeight) + 1;

const shuffleTrafficCars = (amount, element, folder) => {
    const car = Math.ceil(Math.random() * amount);
    element.style.background = `transparent url('./assets/img/${folder}/${car}.png') center no-repeat`;
};

shuffleTrafficCars(PLAYER_CARS, player, 'player');

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

        if (playerRect.top + COLLISION_Y <= opponentRect.bottom &&
            playerRect.right - COLLISION_X >= opponentRect.left &&
            playerRect.left + COLLISION_X <= opponentRect.right &&
            playerRect.bottom - COLLISION_Y >= opponentRect.top) {
                Setting.start = false;
                music.pause();
                start.classList.remove('hidden');
                gameArea.classList.add('hidden');
                start.style.top = score.offsetHeight;
                hud.style.visibility = 'hidden';
        }

        opponent.y += Setting.speed / OPPONENT_SPEED;
        opponent.style.top = `${opponent.y}px`;

        if (opponent.y >= gameArea.offsetHeight) {
            shuffleTrafficCars(TRAFFIC_CARS, opponent, 'traffic');
            opponent.y = -CAR_HEIGHT * OPPONENT_SPEED * Setting.traffic;
            opponent.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - ROAD_OVERFLOW))}px`;
        }
    });
};

const playGame = () => {
    Setting.score += Setting.speed;
    score.textContent = Setting.score;
    moveRoad();
    moveOpponent();
    if (Key.ArrowLeft && Setting.x > ROAD_PADDING_X || Key.a && Setting.x > ROAD_PADDING_X) {
        Setting.x -= Setting.speed / Setting.handling;
    }
    if (Key.ArrowRight && Setting.x < gameArea.offsetWidth - player.offsetWidth - ROAD_PADDING_X ||
        Key.d && Setting.x < gameArea.offsetWidth - player.offsetWidth - ROAD_PADDING_X) {
        Setting.x += Setting.speed / Setting.handling;
    }
    if (Key.ArrowUp && Setting.y > ROAD_PADDING_Y || Key.w && Setting.y > ROAD_PADDING_Y) {
        Setting.y -= Setting.speed / Setting.handling;
    }
    if (Key.ArrowDown && Setting.y < gameArea.offsetHeight - player.offsetHeight - ROAD_PADDING_Y ||
        Key.s && Setting.y < gameArea.offsetHeight - player.offsetHeight - ROAD_PADDING_Y) {
        Setting.y += Setting.speed / Setting.handling;
    }
    player.style.left = `${Setting.x}px`;
    player.style.top = `${Setting.y}px`;
    if (Setting.start) {
        requestAnimationFrame(playGame);
    }
};

const startGame = () => {
    music.play();
    start.classList.add('hidden');
    gameArea.classList.remove('hidden');
    hud.style.visibility = 'visible';
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
        shuffleTrafficCars(TRAFFIC_CARS, opponent, 'traffic');
        gameArea.appendChild(opponent);
    }
    Setting.score = 0;
    Setting.start = true;
    gameArea.appendChild(player);

    player.style.left = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
    player.style.top = 'auto';
    player.style.bottom = '25px';
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

const setDifficulty = evt => {
    intro.classList.add('hidden');
    start.classList.remove('hidden');
    intro.removeEventListener('click', setDifficulty);
    intro.removeEventListener('keydown', setDifficulty);

    if (evt.target.classList.contains('junior')) {
        Setting.speed = 10;
        Setting.traffic = 6;
        Setting.trafficInterval = 100;
        player.style.background = `transparent url('./assets/img/player/1.png') center no-repeat`;
        startGame();
        start.classList.add('hidden');
    } else if (evt.target.classList.contains('middle')) {
        Setting.speed = 20;
        Setting.traffic = 3.5;
        Setting.trafficInterval = 90;
        player.style.background = `transparent url('./assets/img/player/2.png') center no-repeat`;
        startGame();
        start.classList.add('hidden');
    } else if (evt.target.classList.contains('senior')) {
        Setting.speed = 30;
        Setting.traffic = 3.75;
        Setting.trafficInterval = 110;
        Setting.handling = 2.5;
        startGame();
        start.classList.add('hidden');
    }
};

start.addEventListener('click', setDifficulty);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);