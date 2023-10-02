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

