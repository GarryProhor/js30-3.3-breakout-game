//доска
let board;
let boardWidth = 620;
let boardHeight = 600;
let context;

let score = 0;

//игрок
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 25;

let player = {
    x: boardWidth/2 - playerWidth/2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX,
}

//мяч
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x: boardWidth/2,
    y: boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY
}
//блоки
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 10;
let blockRows = 3; //добавить больше по ходу игры
let blockMaxRows = 10; //ограничить количество строк
let blockCount = 0;
//углы стартового блока слева вверху
let blockX = 15;
let blockY = 45;

let gameOver = false;
let paused = false;
let isLastRound = false;


window.onload = function () {
    board = document.querySelector('.board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d'); // рисуем доску

    //рисуем игрока
    context.fillStyle = 'deepskyblue';
    roundRect(context, player.x, player.y, player.width, player.height, 3);
    context.fill();

    let gameStarted = false; // Флаг для отслеживания начала игры

    // Запускаем игру
    context.font = "22px sans-serif";
    context.fillText("Управление игрой осуществляется только", 50, 220);
    context.fillText("c помощью клавиатуры", 50, 260);
    context.font = "16px sans-serif";
    context.fillText("1. Старт / Пауза - Space", 50, 300);
    context.fillText("2. Движение вправо / влево - стрелки ArrowLeft / ArrowRight", 50, 340);
    context.font = "22px sans-serif";
    context.fillText("Настройки игры", 50, 380);
    context.font = "16px sans-serif";
    context.fillText("3. Изменение скорости движения мяча - стрелки ArrowUp / ArrowDown", 50, 420);

    // Функция для начала игры
    function startGame() {
        if (!gameStarted) {
            gameStarted = true; // Устанавливаем флаг начала игры
            document.removeEventListener('keydown', startGame); // Удаляем обработчик события
            document.addEventListener('keydown', movePlayer); // Добавляем обработчик для управления
            createBlocks();
        }
    }

    // Запускаем игру после нажатия клавиши "Пробел"
    document.addEventListener('keydown', function (e) {
        if (e.code === 'Space') {
            startGame();
        }
    });
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        if (gameOver) {
            resetGame();
        } else {
            paused = !paused; // Переключаем режим паузы
            if (paused) {
                // Включить паузу
                cancelAnimationFrame(update);
            } else {
                // Возобновить игру
                requestAnimationFrame(update);
            }
        }
    }
});


function createBlocks() {
    blockArray = []; //очистить блок-массив
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x : blockX + c*blockWidth + c*10, //c*10 интервал между столбцами 10 пикселей
                y : blockY + r*blockHeight + r*10, //r*10 интервал в 10 пикселей между строками
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function update(){
    if (!paused) { // Проверка на паузу
        requestAnimationFrame(update);
        //очистить доску
        if (gameOver) {
            saveGameResult(score);
            return;
        }
        context.clearRect(0,0, board.width, board.height);


//рисуем игрока с скругленными краями
        context.fillStyle = '#8A88B9';
        roundRect(context, player.x, player.y, player.width, player.height, 3); // 5 - радиус скругления
        context.fill();

        //рисуем мяч
        context.fillStyle = 'white';
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;
        context.beginPath();
        context.arc(ball.x + ball.width / 2, ball.y + ball.height / 2, ball.width / 2, 0, Math.PI * 2);
        context.fill();

        //проверка столкновений
        if(ball.y <= 0){
            //если столкнулся с верхней границей
            ball.velocityY *= -1;//меняем направление мяча
        }else if(ball.x <= 0 || ball.x + ball.width >= boardWidth){
            //если столкнулся с левой или правой границей
            ball.velocityX *= -1;//меняем направление мяча
        }else if(ball.y + ball.height >= boardHeight){
            //если столкнулся с нижней границей
            //игрок проиграл
            context.font = "20px sans-serif";
            context.fillText("Игра окончена.", 250, 260);
            context.fillText(`Ваш итоговый счет: ${score}`, 220, 300);
            context.fillText("Нажмите 'Пробел' чтобы начать заново.", 130, 340);
            gameOver = true;
        }

        //отбить мяч от ракетки игрока
        if (topCollision(ball, player) || bottomCollision(ball, player)) {
            ball.velocityY *= -1;   //перевернуть направление вверх или вниз
        }
        else if (leftCollision(ball, player) || rightCollision(ball, player)) {
            ball.velocityX *= -1;   //перевернуть направление вправо или влево
        }


        //рисуем блоки
        context.fillStyle = "#F96855";
        for (let i = 0; i < blockArray.length; i++) {
            let block = blockArray[i];
            if (!block.break) {
                if (topCollision(ball, block) || bottomCollision(ball, block)) {
                    block.break = true;     // блок разрушен
                    ball.velocityY *= -1;   // перевернуть направление вверх или вниз
                    score += 100;
                    blockCount -= 1;
                }
                else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                    block.break = true;     // блок разрушен
                    ball.velocityX *= -1;   // перевернуть направление X влево или вправо
                    score += 100;
                    blockCount -= 1;
                }
                roundRect(context, block.x, block.y, block.width, block.height, 3);
                context.fill();
            }
        }
        //рисуем счет
        context.font = "22px sans-serif";
        context.fillText(score, 10, 25);

        if (blockRows === blockMaxRows) {
            isLastRound = true;
        }

        //следующий уровень
        if (blockCount === 0) {
            score += 100*blockRows*blockColumns; //бонус счета
            blockRows = Math.min(blockRows + 1, blockMaxRows);
            createBlocks();

            if (isLastRound) {
                context.fillStyle = 'white';
                context.font = "20px sans-serif";
                context.fillText("Игра окончена.", 250, 260);
                context.fillText(`Ваш итоговый счет: ${score}`, 220, 300);
                context.fillText("Нажмите 'Пробел' чтобы начать заново.", 130, 340);
                gameOver = true;
            }

        }
    }else {
        // пауза
        context.fillStyle = 'white';
        context.font = "20px sans-serif";
        context.fillText("Пауза", 290, 260);
        context.fillText("Нажмите 'Пробел' чтобы продолжить", 150, 300);
    }
}

function outOfBounds(xPosition){
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e){
    if (gameOver) {
        if (e.code === "Space") {
            resetGame();
        }
        return;
    }
    if(e.code === 'ArrowLeft'){
        let nextPlayerX = player.x - player.velocityX;
        if(!outOfBounds(nextPlayerX)){
            player.x = nextPlayerX;
        }
    }else if(e.code === 'ArrowRight'){
        let nextPlayerX = player.x + player.velocityX;
        if(!outOfBounds(nextPlayerX)){
            player.x = nextPlayerX;
        }
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width //верхний левый угол a не достигает верхнего правого угла b
        && a.x + a.width > b.x //нижний левый угол a не достигает нижнего правого угла b
        && a.y < b.y + b.height //левый нижний угол a не достигает правого верхнего угла b
        && a.y + a.height > b.y; //правый нижний угол a не достигает левого верхнего угла b
}

function topCollision(ball, block) { //a выше b (мяч выше блока)
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}
function bottomCollision(ball, block) { //a ниже b (мяч ниже блока)
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}
function leftCollision(ball, block) { //a слева b (мяч слева блока)
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) { //a справа b (мяч справа блока)
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}
function resetGame() {
    gameOver = false;
    player = {
        x : boardWidth/2 - playerWidth/2,
        y : boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX : playerVelocityX
    }
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }
    blockArray = [];
    blockRows = 3;
    score = 0;
    createBlocks();
}

// Функция для загрузки сохраненных игр из localStorage
function loadGameResults() {
    const games = localStorage.getItem('games');
    if (!games) {
        return new Map();
    }
    const parsedGames = JSON.parse(games);
    const gameResults = new Map();

    // Заполняем Map значениями из localStorage
    for (let i = 0; i < Math.min(parsedGames.length, 10); i++) {
        gameResults.set(i + 1, parsedGames[i].score);
    }

    return gameResults;
}

// Функция для сохранения результатов игры
function saveGameResult(value) {
    const gameResults = loadGameResults();

    // Находим свободный ключ для нового результата
    let newKey = 1;
    while (gameResults.has(newKey)) {
        newKey++;
    }

    // Удаляем десятый (с наименьшим ключом) элемент Map
    if (gameResults.size >= 10) {
        gameResults.delete(10);
    }

    // Добавляем новый результат в Map с найденным ключом
    gameResults.set(newKey, value);

    // Сохраняем обновленный Map в localStorage
    const gamesArray = Array.from(gameResults.values()).map(score => ({ score }));
    localStorage.setItem('games', JSON.stringify(gamesArray));
}

// Загружаем сохраненные результаты игр
const gameResults = loadGameResults();

// Для доступа к результатам по ключам от 1 до 10:
for (let key = 1; key <= 10; key++) {
    if (gameResults.has(key)) {
        const score = gameResults.get(key);
        console.log(`Результат #${key}: ${score}`);
    }
}




// Функция для рисования скругленного прямоугольника
function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.arcTo(x + width, y, x + width, y + radius, radius);
    context.lineTo(x + width, y + height - radius);
    context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    context.lineTo(x + radius, y + height);
    context.arcTo(x, y + height, x, y + height - radius, radius);
    context.lineTo(x, y + radius);
    context.arcTo(x, y, x + radius, y, radius);
    context.closePath();
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'ArrowUp') {
        // Увеличить скорость мяча
        ball.velocityX *= 2;
        ball.velocityY *= 2;
    } else if (e.code === 'ArrowDown') {
        // Уменьшить скорость мяча
        ball.velocityX /= 2;
        ball.velocityY /= 2;
    }
});






