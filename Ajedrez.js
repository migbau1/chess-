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

let lastPositionX = 0;
let lastPositionY = 0;

let disponble;

document.addEventListener("DOMContentLoaded", (e) => {
  ctx.fillStyle = "#000000";
  const board = ctx.fillRect(0, 0, lienzoWidth, lienzoHeigth);

  drawSquares();
  createPieces();
  printPieces();

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
    color = Object.freeze({ white: "#ffffff", black: "#3d4fbd" }),
    draggable = false
  ) {
    this.x = x;
    this.y = y;

    this.w = lienzoHeigth / 8;
    this.h = lienzoHeigth / 8;

    this.c = Object.freeze({ white: "#ffffff", black: "#3d4fbd" });
    this.name = name;

    this.draggable = draggable;
  }
}

class Piece {
  constructor(name, x, y, color, draggable = false) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.pic = new Image();
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

  ctx.fillStyle = squ.c[`${color}`];

  ctx.fillRect(squ.x, squ.y, squ.w, squ.h);
}

function createPieces() {
  let limit = lienzoHeigth / 8;

  //white pieces
  let wrl = new Piece("wrl", 0, lienzoWidth - limit, "white");
  wrl.pic.src = "./assets/img/wr.svg";

  let wnl = new Piece("wnl", limit, lienzoWidth - limit, "white");
  wnl.pic.src = "./assets/img/wn.svg";

  let wbl = new Piece("wbl", limit * 2, lienzoWidth - limit, "white");
  wbl.pic.src = "./assets/img/wb.svg";

  let wq = new Piece("wq", limit * 3, lienzoWidth - limit, "white");
  wq.pic.src = "./assets/img/wq.svg";

  let wk = new Piece("wk", limit * 4, lienzoWidth - limit, "white");
  wk.pic.src = "./assets/img/wk.svg";

  let wbr = new Piece("wbr", limit * 5, lienzoWidth - limit, "white");
  wbr.pic.src = "./assets/img/wb.svg";

  let wnr = new Piece("wnr", limit * 6, lienzoWidth - limit, "white");
  wnr.pic.src = "./assets/img/wn.svg";

  let wrr = new Piece("wrr", limit * 7, lienzoWidth - limit, "white");
  wrr.pic.src = "./assets/img/wr.svg";

  for (i = 0; i < 8; i++) {
    let wp = new Piece(`wp`, limit * i, lienzoWidth - limit * 2, "white");
    wp.pic.src = "./assets/img/wp.svg";
    historyPieces.push(wp);
  }

  //black pieces
  let brl = new Piece("brl", 0, 0, "black");
  brl.pic.src = "./assets/img/br.svg";

  let bnl = new Piece("bnl", limit, 0, "black");
  bnl.pic.src = "./assets/img/bn.svg";

  let bbl = new Piece("bbl", limit * 2, 0, "black");
  bbl.pic.src = "./assets/img/bb.svg";

  let bq = new Piece("bq", limit * 3, 0, "black");
  bq.pic.src = "./assets/img/bq.svg";

  let bk = new Piece("bk", limit * 4, 0, "black");
  bk.pic.src = "./assets/img/bk.svg";

  let bbr = new Piece("bbr", limit * 5, 0, "black");
  bbr.pic.src = "./assets/img/bb.svg";

  let bnr = new Piece("bnr", limit * 6, 0, "black");
  bnr.pic.src = "./assets/img/bn.svg";

  let brr = new Piece("brr", limit * 7, 0, "black");
  brr.pic.src = "./assets/img/br.svg";

  for (i = 0; i < 8; i++) {
    let bp = new Piece(`bp`, limit * i, limit, "black");
    bp.pic.src = "./assets/img/bp.svg";
    historyPieces.push(bp);
  }

  historyPieces.push(
    wrl,
    wnl,
    wbl,
    wq,
    wk,
    wbr,
    wnr,
    wrr,
    brl,
    bnl,
    bbl,
    bq,
    bk,
    bbr,
    bnr,
    brr
  );
}

function printPieces() {
  ctx2.clearRect(0, 0, lienzoWidth, lienzoHeigth);

  for (let i = 0; i < historyPieces.length; i++) {
    const element = historyPieces[i];
    let isLoaded = element.pic.complete && Image.naturalHeight !== 0;
    if (!isLoaded) {
      element.pic.onload = () => {
        ctx2.drawImage(element.pic, element.x, element.y, element.w, element.h);
      };
    } else {
      ctx2.drawImage(element.pic, element.x, element.y, element.w, element.h);
    }
  }
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

//this function verified if square is available
function usedSquared(square) {
  let found = false;
  let position = -1;
  let index = 0;

  const orderListPieces = historyPieces.sort((a, b) => {
    if (a.y > b.y) {
      return 1;
    }
    if (a.y < b.y) {
      return -1;
    }
    return 0;
  });

  while (!found && index < orderListPieces.length) {
    if (
      orderListPieces[index].x === square.x &&
      orderListPieces[index].y === square.y
    ) {
      found = true;
      position = index;
    }
    index++;
  }
  return position === -1 ? false : orderListPieces[position];
}

function legalMovement(piece, arraySquares) {
  let availableMovements = [];

  switch (piece.name) {
    case "wp":
      if (piece.y < lienzoHeigth - 62.5 * 2) {
        availableMovements.push(
          infoSquareSelected(arraySquares, piece.x, piece.y - 62.5)
        );
        // ctx2.fillStyle = "green";
        // ctx2.fillRect(piece.x, piece.y - 62.5, piece.w, piece.h);
      } else {
        // ctx2.fillStyle = "green";
        // ctx2.fillRect(piece.x, piece.y - 62.5, piece.w, piece.h);
        availableMovements.push(
          infoSquareSelected(arraySquares, piece.x, piece.y - 62.5)
        );
        // ctx2.fillStyle = "green";
        // ctx2.fillRect(piece.x, piece.y - 62.5 * 2, piece.w, piece.h);
        availableMovements.push(
          infoSquareSelected(arraySquares, piece.x, piece.y - 62.5 * 2)
        );
      }
      break;

    case "bp":
      if (piece.y > 62.5) {
        availableMovements.push(
          infoSquareSelected(arraySquares, piece.x, piece.y + 62.5)
        );

        // ctx2.fillStyle = "green";
        // ctx2.fillRect(piece.x, piece.y + 62.5, piece.w, piece.h);
      } else {
        // ctx2.fillStyle = "green";
        // ctx2.fillRect(piece.x, piece.y + 62.5, piece.w, piece.h);
        availableMovements.push(
          infoSquareSelected(arraySquares, piece.x, piece.y + 62.5)
        );

        // ctx2.fillStyle = "green";
        // ctx2.fillRect(piece.x, piece.y + 62.5 * 2, piece.w, piece.h);
        availableMovements.push(
          infoSquareSelected(arraySquares, piece.x, piece.y + 62.5 * 2)
        );
      }
      break;

    case piece === false:
      availableMovements = [];
      break;

    default:
      break;
  }
  disponble = availableMovements;
  return availableMovements;
}

function canMove(move) {
  let found = false;
  let position = -1;
  let index = 0;

  while ((!found, index < disponble.length)) {
    if (disponble[index].x === move.x && disponble[index].y === move.y) {
      found = true;
      position = index;
    }
    index++;
  }

  return position === -1 ? false : true;
}

function mouseDown(e) {
  // tell the browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();

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

  let response = usedSquared(value);

  dragOk = false;
  if (response !== undefined) {
    legalMovement(response, orderArray);
    for (let i = 0; i < historyPieces.length; i++) {
      const element = historyPieces[i];
      if (element.x === response.x && element.y === response.y) {
        dragOk = true;
        element.draggable = true;
      }
    }
    positionX = rx;
    postionY = ry;

    lastPositionX = 0;
    lastPositionY = 0;
  }
}

function mouseUp(e) {
  // tell the browser we're handling this mouse event
  e.preventDefault();
  e.stopPropagation();

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

  let moveFin = infoSquareSelected(orderArray, rx, ry);
  dragOk = false;

  if (disponble.length <= 0) {
    printPieces();
  }

  for (let i = 0; i < historyPieces.length; i++) {
    const element = historyPieces[i];
    if (element.draggable && canMove(moveFin)) {
      element.x = moveFin.x;
      element.y = moveFin.y;
    } else if (element.draggable) {

      element.x = element.x + lastPositionX;
      element.y = element.y + lastPositionY;
    }
    element.draggable = false;
  }

  printPieces();
}

function mouseMove(e) {
  // tell the browser we're handling this mouse event

  if (dragOk) {
    e.preventDefault();
    e.stopPropagation();

    let rx = e.clientX - rect.left;
    let ry = e.clientY - rect.top;

    let dx = rx - positionX;
    let dy = ry - postionY;

    for (let i = 0; i < historyPieces.length; i++) {
      const element = historyPieces[i];
      if (element.draggable) {
        element.x += dx;
        element.y += dy;
      }
    }

    printPieces();

    lastPositionX -= dx;
    lastPositionY -= dy;

    positionX = rx;
    postionY = ry;
  }
}
