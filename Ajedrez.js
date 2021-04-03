const lienzo = document.getElementById("lienzo");
const lienzoWidth = lienzo.width;
const lienzoHeigth = lienzo.height;

const ctx = lienzo.getContext("2d");
const rect = lienzo.getBoundingClientRect();

let historySquares = [];
let count = 0;

document.addEventListener("DOMContentLoaded", (e) => {
  ctx.fillStyle = "#000000";
  const board = ctx.fillRect(0, 0, lienzoWidth, lienzoHeigth);

  drawSquares();
  lienzo.onmousedown = mouseDown;
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
  constructor(name, x, y, color, pic) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.pic = pic;
  }
}

function drawSquares() {
  let limit = 8;
  let sizeLimit = lienzoWidth / 8;

  let px = 0;
  let py = 500 - sizeLimit;

  let color = "black";

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

function mouseDown(e) {
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
  console.log(value);
}

//this function in in charge of display info to square selected recursively
function infoSquareSelected(array, itemX, itemY) {
  let puntoMedio = Math.floor(array.length / 2);

  if (array.length <= 8) {
    if (array.length === 1) {
      return array[puntoMedio];
    }

    if (itemX > array[puntoMedio].x) {
      return arguments.callee(array.slice(puntoMedio), itemX, itemY);
    }

    if (itemX < array[puntoMedio].x) {
      return arguments.callee(array.slice(0, puntoMedio), itemX, itemY);
    }
  }

  if (
    array.length <= puntoMedio &&
    itemY > array[puntoMedio].y &&
    itemY < array[puntoMedio + 8].y
  ) {
    return arguments.callee(
      array.slice(puntoMedio, puntoMedio + 8),
      itemX,
      itemY
    );
  }

  if (itemY > array[puntoMedio].y) {
    return arguments.callee(array.slice(puntoMedio), itemX, itemY);
  }

  if (
    array.length <= puntoMedio &&
    itemY < array[puntoMedio].y &&
    itemY > array[puntoMedio - 8].y
  ) {
    return arguments.callee(array.slice(puntoMedio - 8, puntoMedio));
  }

  if (itemY < array[puntoMedio].y) {
    return arguments.callee(array.slice(0, puntoMedio), itemX, itemY);
  }
}
