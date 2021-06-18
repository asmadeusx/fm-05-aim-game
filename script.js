'use strict';

const startBtn = document.querySelector('#start');
const screens = document.querySelectorAll('.screen');
const timeList = document.querySelector('#time-list');
const timeEl = document.querySelector('#time');
const board = document.querySelector('#board');
let time = 0;
let score = 0;
let missCount = 0;

//#region Код с ДЗ

function randomColor() {
    let r = getRandomNumber(0, 255);
    let g = getRandomNumber(0, 255);
    let b = getRandomNumber(0, 255);
    return `rgb(${r}, ${g}, ${b})`;
}

function addTimeBtns() {
    timeList.innerHTML = ``;
    let numBtns = 6;
    for (let i = 1; i <= numBtns; i++) {
        const timeBtn = document.createElement('li');
        // timeBtn.classList.add('time-btn');
        timeBtn.innerHTML = `
        <button class="time-btn" data-time='${i}0'>
          ${i}0 сек
        </button>
        `;
        timeList.append(timeBtn);
    }
}

addTimeBtns();

//#endregion


//#region Код с Урока

//#region Оглашение Функций
function setTime(value) {
    timeEl.innerHTML = `00:${value}`;
}

// Добавлено условие "состояние игры" для отслеживания промахов.
function finishGame() {
    // Добавлены "Промахи" из ДЗ
    board.innerHTML = `
    <h1>Cчет: <span class="primary">${score}</span></h1>
    <h3>Промахи: <span class="primary">${missCount}</span></h3>
    `;
    timeEl.parentNode.classList.add('hide');
    board.classList.remove('GAME');
}
// Добавлено "состояние игры" для отслеживания промахов.
function startGame() {
    setInterval(decreaseTime, 1000);
    createRandomCircle();
    setTime(time);
    board.classList.add('GAME');
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

    circle.style.background = randomColor(); // Код из ДЗ

    board.append(circle);
}

function getRandomNumber(minValue, maxValue) {
    return (Math.random() * (maxValue - minValue) + minValue);
}
//#endregion

//#region Обработчики Событий
startBtn.addEventListener('click', (event) => {
    event.preventDefault();
    screens[0].classList.add('up');
});

timeList.addEventListener('click', (event) => {
    if (event.target.classList.contains('time-btn')) {
        time = parseInt(event.target.getAttribute('data-time'));
        screens[1].classList.add('up');
        startGame();
    }
});
// Добавлено условие "состояние игры" для отслеживания промахов.
board.addEventListener('click', (evemt) => {
    if (event.target.classList.contains('circle')) {
        score++;
        event.target.remove();
        createRandomCircle();
    } else if (evemt.target.classList.contains('board') && evemt.target.classList.contains('GAME')) {
        missCount++;
    }
    
});
//#endregion

//#endregion