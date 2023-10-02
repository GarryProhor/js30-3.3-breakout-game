//доска
let board;
let boardWidth = 600;
let boardHeight = 600;
let context;

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

window.onload = function () {
    board = document.querySelector('.board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d'); // рисуем доску

    //рисуем игрока
    context.fillStyle = 'deepskyblue';
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener('keydown', movePlayer);
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0,0, board.width, board.height);

    //рисуем игрока
    context.fillStyle = 'deepskyblue';
    context.fillRect(player.x, player.y, player.width, player.height);

    //рисуем мяч
    context.fillStyle = 'white';
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

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
    }
}

function outOfBounds(xPosition){
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}

function movePlayer(e){
    if(e.code == 'ArrowLeft'){
        // player.x -= player.velocityX;
        let nextPlayerX = player.x - player.velocityX;
        if(!outOfBounds(nextPlayerX)){
            player.x = nextPlayerX;
        }
    }else if(e.code == 'ArrowRight'){
        // player.x += player.velocityX;
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

