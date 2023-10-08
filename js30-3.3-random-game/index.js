//доска
let board;
let boardWidth = 620;
let boardHeight = 600;
let context;

let score = 0;

//игрок
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;

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

window.onload = function () {
    board = document.querySelector('.board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d'); // рисуем доску

    //рисуем игрока
    context.fillStyle = 'deepskyblue';
    context.fillRect(player.x, player.y, player.width, player.height);

    let gameStarted = false; // Флаг для отслеживания начала игры

    // Запускаем игру
    context.font = "20px sans-serif";
    context.fillText("Старт", 280, 260);
    context.fillText("Для того чтобы начать игру нажмите 'Пробел'", 110, 300);
    context.fillText("Для управления воспользуйтесь стрелками на клавиатуре", 50, 340);

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

        //рисуем игрока
        context.fillStyle = '#8A88B9';
        context.fillRect(player.x, player.y, player.width, player.height);
        context.lineCap = 'round';


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
                context.fillRect(block.x, block.y, block.width, block.height);
            }
        }
        //рисуем счет
        context.font = "22px sans-serif";
        context.fillText(score, 10, 25);

        //следующий уровень
        if (blockCount === 0) {
            score += 100*blockRows*blockColumns; //бонус счета
            blockRows = Math.min(blockRows + 1, blockMaxRows);
            createBlocks();
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

// функция сохранить результаты в localStorage
function saveGameResult(value) {
    const games = localStorage.getItem('games');

    if (!games) {
        const data = JSON.stringify([{score: value}]);
        localStorage.setItem(`games`, data);
    } else {
        const parsedGames = JSON.parse(games);
        parsedGames.push({score: value});

        if (parsedGames.length > 10) {
            parsedGames.shift();
        }

        localStorage.setItem('games', JSON.stringify(parsedGames));
    }
}








