//доска
let board;
let boardWidth = 600;
let boardHeight = 600;
let context;

window.onload = function () {
    board = document.querySelector('.board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d'); // рисуем доску
}