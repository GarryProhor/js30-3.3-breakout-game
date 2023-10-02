//доска
let board;
let boardWidth = 600;
let boardHeight = 600;
let context;

//игрок
let playerWidth = 80;
let playerHeight = 10;

let player = {
    x: boardWidth/2 - playerWidth/2,
    y: boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight
}

window.onload = function () {
    board = document.querySelector('.board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d'); // рисуем доску

    //рисуем игрока
    context.fillStyle = 'deepskyblue';
    context.fillRect(player.x, player.y, player.width, player.height);
}