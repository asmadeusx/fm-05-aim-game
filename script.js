'use strict';

const startBtn = document.querySelector('#start-btn');
const screens = document.querySelectorAll('.screen');
const timeList = document.querySelector('#time-list');
const sizeList = document.querySelector('#size-list');
const difficultList = document.querySelector('#difficult-list');
const timeEl = document.querySelector('#time');
const board = document.querySelector('#board');
const startAgainBtn = document.querySelector('#startAgain-btn');
let time = 0;
let size;
let difficult = 'Легко';
let timer;
let score = 0;
let missCount = 0;

//#region Функции
function randomColor() {
    let r = getRandomNumber(0, 255);
    let g = getRandomNumber(0, 255);
    let b = getRandomNumber(0, 255);
    return `rgb(${r}, ${g}, ${b})`;
}

//#region Добавление Кнопок для выбора параметров игры
addTimeBtns();
function addTimeBtns() {
    timeList.innerHTML = ``;
    let numBtns = 6;
    for (let i = 1; i <= numBtns; i++) {
        const timeBtn = document.createElement('li');
        timeBtn.innerHTML = `
        <button class="time-btn" data-time='${i}0'>
          ${i}0 сек
        </button>
        `;
        timeList.append(timeBtn);
    }
}

addDifficultBtns();
function addDifficultBtns() {
    difficultList.innerHTML = ``;
    let numBtns = 3;
    const gameDifficult = [
        'Легко', 'Нормально', 'Сложно'
    ];
    for (let i = 0; i <= numBtns - 1; i++) {
        const difficultBtn = document.createElement('li');
        difficultBtn.innerHTML = `
        <button class="difficult-btn" data-difficult=${gameDifficult[i]}>
          ${gameDifficult[i]}
        </button>
        `;
        difficultList.append(difficultBtn);
    }
}
//#endregion

function toggleTimer(status) {
    if (status === 'start') {
        timer = setInterval(decreaseTime, 1000);
    } else if (status === 'stop') {
        clearInterval(timer);
    }
}

function setTime(value) {
    timeEl.innerHTML = `00:${value}`;
}

function finishGame() {
    board.innerHTML = `
    <h1>Cчет: <span class="primary">${score}</span></h1>
    <h3>Промахи: <span class="primary">${missCount}</span></h3>
    `;
    timeEl.parentNode.classList.add('hide');
    board.classList.remove('GAME');
    toggleTimer('stop');
}

function startGame() {
    createRandomCircle();
    setTime(time);
    board.classList.add('GAME');
    toggleTimer('start');
}

function decreaseTime() {
    if (time === 0) {
        finishGame();
    } else {
        let current = --time;
        if (current < 10) {
            current = `0${current}`;
        }
        setTime(current);
    }
}

function circleFading() {
    const circle = document.querySelector('.circle');
    switch(difficult) {
        case 'Легко': {
            circle.classList.add('circleFadingEasy');
            setTimeout(() => {circle.classList.add('circleFaded');}, 5000);
            break;
        }
        case 'Нормально': {
            circle.classList.add('circleFadingMedium');
            setTimeout(() => {circle.classList.add('circleFaded');}, 4000);
            break;
        }
        case 'Сложно': {
            circle.classList.add('circleFadingHard');
            setTimeout(() => {circle.classList.add('circleFaded');}, 500);
            break;
        }
    }   
}

setInterval(removeFadedCircle, 200);
function removeFadedCircle() {
    const circle = document.querySelector('.circle');
    if (circle && circle.classList.contains('circleFaded')) {
        circle.remove();
        missCount++;
        createRandomCircle();
    }
}

function createRandomCircle() {
    const circle = document.createElement('div');
    const size = getRandomNumber(10, 60);
    const {
        width,
        height
    } = board.getBoundingClientRect();
    const x = getRandomNumber(0, width - size);
    const y = getRandomNumber(0, height - size);

    circle.classList.add('circle');
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.top = `${y}px`;
    circle.style.left = `${x}px`;

    circle.style.background = randomColor();

    board.append(circle);
    setTimeout(circleFading, 300);
}

function getRandomNumber(minValue, maxValue) {
    return (Math.random() * (maxValue - minValue) + minValue);
}
//#endregion

//#region Обработчики Событий
startBtn.addEventListener('click', () => {
    screens[0].classList.add('up');
});

timeList.addEventListener('click', (event) => {
    if (event.target.classList.contains('time-btn')) {
        time = parseInt(event.target.getAttribute('data-time'));
        screens[1].classList.add('up');
    }
});

difficultList.addEventListener('click', (event) => {
    if (event.target.classList.contains('difficult-btn')) {
        difficult = (event.target.getAttribute('data-difficult'));
        screens[2].classList.add('up');
        console.log(difficult);
        switch(difficult) {
            case 'Легко': {
                size = 300;
                break;
            }
            case 'Нормально': {
                size = 500;
                break;
            }
            case 'Сложно': {
                size = 700;
                break;
            }
        }
        board.style.width = `${size}px`;
        board.style.height = `${size}px`;
        startGame();
    }
});

board.addEventListener('click', (event) => {
    if (event.target.classList.contains('circle')) {
        score++;
        event.target.remove();
        createRandomCircle();
    } else if (event.target.classList.contains('board') && event.target.classList.contains('GAME')) {
        missCount++;
    }
    
});

startAgainBtn.addEventListener('click', () => {
    screens.forEach((screen) => {
        screen.classList.remove('up');
        board.innerHTML = ``;
        timeEl.parentNode.classList.remove('hide');
    });
});
//#endregion