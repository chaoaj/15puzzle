let grid = [];
let tileSize;
let emptyPos = { x: 3, y: 3 };
let dragStartX, dragStartY;
let isDragging = false;

function setup() {
  createCanvas(windowWidth > windowHeight ? windowWidth : windowHeight);
  tileSize = floor((width - 20) / 4);

  initGrid();
  shuffleTiles();
}

function draw() {
  background(30);

  // Draw title and instructions
  fill(255);
  textSize(28);
  textAlign(CENTER, TOP);
  text("15 Puzzle", width / 2, 20);

  textSize(16);
  fill(200);
  textAlign(CENTER);
  if (checkWin()) {
    text("You Won! Tap to restart", width / 2, 45);
  } else {
    text("Swipe or tap adjacent tiles to move", width / 2, 45);
  }

  // Draw grid border with better padding
  stroke(100);
  strokeWeight(3);
  noFill();
  rect(width/2 - tileSize*2 + 6, 70, tileSize * 4 - 12, tileSize * 4 - 12);

  // Check win condition and show overlay
  if (checkWin()) {
    fill(0, 180, 0, 150);
    rect(0, 0, width, height);

    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("YOU WON!", width / 2, height / 2 - 40);
    textSize(18);
    text("Tap to play again", width / 2, height / 2 + 10);

    if (mouseIsPressed || touchIsPressed) {
      initGrid();
      shuffleTiles();
    }
    return;
  }

  // Draw grid and tiles with adjusted offsets
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let tileValue = grid[row][col];

      if (tileValue === 0) continue; // Skip empty space

      let x = width/2 - tileSize*2 + 6 + col * tileSize + 6;
      let y = 70 + row * tileSize + 6;

      // Draw tile background with shadow effect
      fill(50);
      rect(x, y, tileSize - 12, tileSize - 12, 8);

      // Draw number
      fill(255);
      textSize(floor(tileSize / 3));
      textAlign(CENTER, CENTER);
      text(tileValue, x + tileSize/2, y + tileSize/2);
    }
  }

  // Highlight empty space location
  let ex = width/2 - tileSize*2 + 6 + emptyPos.x * tileSize;
  let ey = 70 + emptyPos.y * tileSize;
  stroke(80);
  noFill();
  rect(ex, ey, tileSize, tileSize, 8);
}

function windowResized() {
  if (windowWidth > windowHeight) {
    resizeCanvas(windowHeight, windowHeight);
  } else {
    resizeCanvas(windowWidth, windowWidth);
  }
  tileSize = floor((width - 20) / 4);
}

// Initialize grid with solved state
function initGrid() {
  for (let row = 0; row < 4; row++) {
    grid[row] = [];
    for (let col = 0; col < 4; col++) {
      let value = row * 4 + col + 1;
      if (row === 3 && col === 3) {
        value = 0; // Empty space at bottom-right
      }
      grid[row][col] = value;
    }
  }
}

// Shuffle tiles by making random valid moves
function shuffleTiles() {
  let previousPos = { x: -1, y: -1 };

  for (let i = 0; i < 300; i++) {
    let neighbors = getNeighbors(emptyPos.x, emptyPos.y);
    // Make sure we don't undo the last move
    neighbors = neighbors.filter(n => !(n.x === previousPos.x && n.y === previousPos.y));

    if (neighbors.length > 0) {
      let randomNeighbor = neighbors[floor(random(neighbors.length))];
      swapTile(emptyPos.x, emptyPos.y, randomNeighbor.x, randomNeighbor.y);
      previousPos = { x: emptyPos.x, y: emptyPos.y };
    }
  }
}

// Get valid neighbor positions for the empty space
function getNeighbors(x, y) {
  let neighbors = [];

  // Check all four directions (up, down, left, right)
  if (y > 0) neighbors.push({ x: x, y: y - 1 }); // Up
  if (y < 3) neighbors.push({ x: x, y: y + 1 }); // Down
  if (x > 0) neighbors.push({ x: x - 1, y: y }); // Left
  if (x < 3) neighbors.push({ x: x + 1, y: y }); // Right

  return neighbors;
}

// Swap tile with empty space
function swapTile(x1, y1, x2, y2) {
  let temp = grid[y1][x1];
  grid[y1][x1] = grid[y2][x2];
  grid[y2][x2] = temp;

  if (y1 === emptyPos.y && x1 === emptyPos.x) {
    emptyPos = { x: x2, y: y2 };
  } else if (y2 === emptyPos.y && x2 === emptyPos.x) {
    emptyPos = { x: x1, y: y1 };
  }
}

// Check if the puzzle is in solved state
function checkWin() {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let expectedValue = row * 4 + col + 1;
      if (row === 3 && col === 3) {
        expectedValue = 0; // Empty space at bottom-right
      }

      if (grid[row][col] !== expectedValue) {
        return false;
      }
