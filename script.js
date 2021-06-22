'use strict';
//#region Переменные и Массивы
const startBtn = document.querySelector('#start-btn');
const screens = document.querySelectorAll('.screen');
const timeList = document.querySelector('#time-list');
const sizeList = document.querySelector('#size-list');
const difficultList = document.querySelector('#difficult-list');
const bgColorBtnsList = document.querySelector('#bgColorBtns-list');
const timeEl = document.querySelector('#time');
const board = document.querySelector('#board');
const startAgainBtn = document.querySelector('#startAgain-btn');
let time = 0;
let size;
let difficult = 'Легко';
let timer;
let score = 0;
let missCount = 0;
let bgColor;
const gameDifficult = [
    'Легко',
    'Нормально',
    'Сложно'
];
const bgColors = [{
        'bgName': 'Красный',
        'bgScreen': 'linear-gradient(90deg, rgba(121,9,9,1) 0%, rgba(255,107,107,1) 100%)',
        'bgBoard': 'linear-gradient(118.38deg, rgb(60, 41, 41) -4.6%, rgb(99, 72, 72) 200.44%)',
    },
    {
        'bgName': 'Синий',
        'bgScreen': 'linear-gradient(90deg, rgba(14,15,84,1) 0%, rgba(31,45,223,1) 100%)',
        'bgBoard': 'linear-gradient(118.38deg, rgb(53 53 95) -4.6%, rgb(44 49 189) 200.44%)',
    },
    {
        'bgName': 'Зеленый',
        'bgScreen': 'linear-gradient(90deg, rgba(14,84,21,1) 0%, rgba(31,223,50,1) 100%)',
        'bgBoard': 'linear-gradient(118.38deg, rgb(41, 60, 44) -4.6%, rgb(72, 99, 73) 200.44%)',
    },
    {
        'bgName': 'Оригинал',
        'bgScreen': 'linear-gradient(90deg, #29323C 0%, #485563 100%)',
        'bgBoard': 'linear-gradient(118.38deg, #29323C -4.6%, #485563 200.44%)',
    }
];
const btns = [{
        'parentList': timeList,
        'numBtns': 6,
        'btnClass': 'time-btn',
        'btnData': 'data-time',
    },
    {
        'parentList': difficultList,
        'numBtns': 3,
        'btnClass': 'difficult-btn',
        'btnData': 'data-difficult',
    },
    {
        'parentList': bgColorBtnsList,
        'numBtns': 4,
        'btnClass': 'bgColor-btn',
        'btnData': 'data-bgColor',
    },
];

//#endregion

//#region Функции
function randomColor() {
    let r = getRandomNumber(0, 255);
    let g = getRandomNumber(0, 255);
    let b = getRandomNumber(0, 255);
    return `rgb(${r}, ${g}, ${b})`;
}

function addBtns(parentList, numBtns, btnClass, btnData) {
    parentList.innerHTML = ``;
    let n = numBtns;
    for (let i = 1; i <= n; i++) {
        const elem = document.createElement('li');
        if (btnClass === 'time-btn') {
            elem.innerHTML = `
            <button class='${btnClass}' ${btnData}='${i}0'>
                ${i}0 сек
            </button>
            `;
        }
        if (btnClass === 'difficult-btn') {
            elem.innerHTML = `
            <button class='${btnClass}' ${btnData}=${gameDifficult[i-1]}>
              ${gameDifficult[i-1]}
            </button>
            `;
        }
        if (btnClass === 'bgColor-btn') {
            elem.innerHTML = `
            <button class='${btnClass}' ${btnData}=${bgColors[i-1].bgName}>
              ${bgColors[i-1].bgName}
            </button>
            `;
            // document.querySelector('.bgColor-btn').style.background = `${bgColors[i-1].bgScreen}`;
        }
        parentList.append(elem);
    }
}
for (let i = 0; i < btns.length; i++) {
    addBtns(btns[i].parentList, btns[i].numBtns, btns[i].btnClass, btns[i].btnData);
}

coloringBgBtns();

function coloringBgBtns() {
    const bgColorsBtns = document.querySelectorAll('.bgColor-btn');
    for (let i = 0; i < bgColorsBtns.length; i++) {
        bgColorsBtns[i].style.background = `${bgColors[i].bgScreen}`;
    }
}

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
    if (circle) {
        switch (difficult) {
            case 'Легко': {

                circle.classList.add('circleFadingEasy');
                setTimeout(() => {
                    circle.classList.add('circleFaded');
                }, 5000);
                break;
            }
            case 'Нормально': {
                circle.classList.add('circleFadingMedium');
                setTimeout(() => {
                    circle.classList.add('circleFaded');
                }, 4000);
                break;
            }
            case 'Сложно': {
                circle.classList.add('circleFadingHard');
                setTimeout(() => {
                    circle.classList.add('circleFaded');
                }, 500);
                break;
            }
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
        switch (difficult) {
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

bgColorBtnsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('bgColor-btn')) {
        bgColor = event.target.getAttribute('data-bgColor');
        switch (bgColor) {
            case bgColors[0].bgName: {
                screens.forEach(screen => {
                    screen.style.background = bgColors[0].bgScreen;
                });
                board.style.background = bgColors[0].bgBoard;
                break;
            }
            case bgColors[1].bgName: {
                screens.forEach(screen => {
                    screen.style.background = bgColors[1].bgScreen;
                });
                board.style.background = bgColors[1].bgBoard;
                break;
            }
            case bgColors[2].bgName: {
                screens.forEach(screen => {
                    screen.style.background = bgColors[2].bgScreen;
                });
                board.style.background = bgColors[2].bgBoard;
                break;
            }
            case bgColors[3].bgName: {
                screens.forEach(screen => {
                    screen.style.background = bgColors[3].bgScreen;
                });
                board.style.background = bgColors[3].bgBoard;
                break;
            }
        }
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