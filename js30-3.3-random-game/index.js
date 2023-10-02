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

function movePlayer(e){
    if(e.code == 'ArrowLeft'){
        player.x -= player.velocityX;
    }else if(e.code == 'ArrowRight'){
        player.x += player.velocityX;
    }
}

