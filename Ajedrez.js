const lienzo = document.getElementById("lienzo");
const boardPieces = document.getElementById("boardPieces");

const lienzoWidth = lienzo.width;
const lienzoHeigth = lienzo.height;

const ctx = lienzo.getContext("2d");
const ctx2 = boardPieces.getContext("2d");
const rect = lienzo.getBoundingClientRect();

let historySquares = [];
let historyPieces = [];

let dragOk = false;
let positionX;
let postionY;

document.addEventListener("DOMContentLoaded", (e) => {
  ctx.fillStyle = "#000000";
  const board = ctx.fillRect(0, 0, lienzoWidth, lienzoHeigth);

  drawSquares();
  putPieces();
  lienzo.onmousedown = mouseDown;
  lienzo.onmouseup = mouseUp;
  lienzo.onmousemove = mouseMove;

  boardPieces.onmousedown = mouseDown;
  boardPieces.onmouseup = mouseUp;
  boardPieces.onmousemove = mouseMove;
});

class Square {
  constructor(
    x = 0,
    y = 0,
    name,
    color = Object.freeze({ white: "#ffffff", black: "#000000" }),
    draggable = false
  ) {
    this.x = x;
    this.y = y;

    this.w = lienzoHeigth / 8;
    this.h = lienzoHeigth / 8;

    this.c = color;
    this.name = name;

    this.draggable = draggable;
  }
}

class Piece {
  constructor(name, x, y, color, pic, draggable = false) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.pic = pic;
    this.draggable = draggable;
    this.w = lienzoHeigth / 8;
    this.h = lienzoHeigth / 8;
  }
}

function drawSquares() {
  let limit = 8;
  let sizeLimit = lienzoWidth / 8;

  let px = 0;
  let py = 500 - sizeLimit;

  let color = "black";
  let count = 0;
  let alphabet = "abcdefghi";

  for (let i = limit; i > 0; i--) {
    for (let j = 0; j < limit; j++) {
      let letter = alphabet.charAt(j);

      draw(px, py, color, `${letter.toUpperCase()}.${count + 1}`);

      px >= lienzoWidth - sizeLimit ? (px = 0) : (px += sizeLimit);

      color === "black" ? (color = "white") : (color = "black");
    }

    py -= sizeLimit;
    color !== "black" ? (color = "black") : (color = "white");
    count++;
  }
}

function draw(x, y, color, name) {
  let squ = new Square(x, y, name, color);
  historySquares.push(squ);

  ctx.fillStyle = squ.c;

  ctx.fillRect(squ.x, squ.y, squ.w, squ.h);
}

function putPieces() {
  let piece = new Piece("torre", 0, 437.5, "white", "./assets/img/wr.svg");
  createPiece(piece.x, piece.y, piece.w, piece.h, piece.pic);
}

function createPiece(x, y, w, h, pic) {

  let img = new Image();
  img.onload = () => {
    clear(0, 0, w, h)
    ctx2.drawImage(img, x, y, w, h);
  };
  img.src = pic;
}

function clear(x, y, w, h) {
  ctx2.clearRect(x, y, boardPieces.width, boardPieces.height);
}

//this function in in charge of display info to square selected recursively
function infoSquareSelected(array, itemX, itemY) {
  let puntoMedio = Math.floor(array.length / 2);

  if (array.length <= 8) {
    if (array.length === 1) {
      return array[puntoMedio];
    }

    if (itemX >= array[puntoMedio].x) {
      return arguments.callee(array.slice(puntoMedio), itemX, itemY);
    }

    if (itemX <= array[puntoMedio].x) {
      return arguments.callee(array.slice(0, puntoMedio), itemX, itemY);
    }
  }

  if (
    array.length <= puntoMedio &&
    itemY >= array[puntoMedio].y &&
    itemY <= array[puntoMedio + 8].y
  ) {
    return arguments.callee(
      array.slice(puntoMedio, puntoMedio + 8),
      itemX,
      itemY
    );
  }

  if (itemY >= array[puntoMedio].y) {
    return arguments.callee(array.slice(puntoMedio), itemX, itemY);
  }

  if (
    array.length <= puntoMedio &&
    itemY <= array[puntoMedio].y &&
    itemY >= array[puntoMedio - 8].y
  ) {
    return arguments.callee(array.slice(puntoMedio - 8, puntoMedio));
  }

  if (itemY <= array[puntoMedio].y) {
    return arguments.callee(array.slice(0, puntoMedio), itemX, itemY);
  }
}

function mouseDown(e) {
  // tell the browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();

  let limit = 8;
  let heightMax = lienzoWidth / limit;
  let sizeMax = lienzoHeigth - heightMax;

  let rx = e.clientX - rect.left;
  let ry = e.clientY - rect.top;

  const orderArray = historySquares.sort((a, b) => {
    if (a.y > b.y) {
      return 1;
    }
    if (a.y < b.y) {
      return -1;
    }
    return 0;
  });

  let value = infoSquareSelected(orderArray, rx, ry);
  dragOk = true;
}

function mouseUp(e) {
  // tell the browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();
  dragOk = false;
}

function mouseMove(e) {
  // tell the browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();

  let rx = e.clientX - rect.left;
  let ry = e.clientY - rect.top;

  
  if (dragOk) {
    createPiece(rx - (62.5 / 2), ry - (62.5 /2), 62.5, 62.5, "./assets/img/wr.svg");
  }
}
