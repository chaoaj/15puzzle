// 15 Puzzle Game - p5.js implementation
let grid = [];
let emptyPos = { x: 3, y: 3 }; // Empty space position (x=column, y=row)
let tileSize;
let isDragging = false;
let dragStartX, dragStartY;

function setup() {
  createCanvas(400, 440);
  tileSize = width / 4;

  // Initialize solved grid state first
  initGrid();

  // Then shuffle (ensure solvable)
  shuffleTiles();
}

function draw() {
  background(255);

  // Draw title
  fill(0);
  textSize(16);
  textAlign(CENTER, TOP);
  text("15 Puzzle", width / 2, 10);

  // Check win condition
  if (checkWin()) {
    noStroke();
    fill(0, 200, 0, 180);
    rect(0, 0, width, height);

    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("You Won!", width / 2, height / 2 - 30);
    textSize(16);
    text("Tap to restart", width / 2, height / 2 + 20);

    if (mouseIsPressed) {
      initGrid();
      shuffleTiles();
    }
    return;
  }

  // Draw grid and tiles
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let tileValue = grid[row][col];

      if (tileValue === 0) continue; // Skip empty space

      let x = col * tileSize + 2;
      let y = row * tileSize + 42;

      // Draw tile background with shadow
      fill(50);
      rect(x, y, tileSize - 4, tileSize - 4, 5);

      // Draw number
      fill(255);
      textSize(tileSize / 3);
      textAlign(CENTER, CENTER);
      text(tileValue, x + tileSize/2, y + tileSize/2);
    }
  }

  // Highlight empty space
  let ex = emptyPos.x * tileSize;
  let ey = emptyPos.y * tileSize;
  stroke(150);
  noFill();
  rect(ex, ey, tileSize, tileSize);
}

function initGrid() {
  grid = [];
  for (let row = 0; row < 4; row++) {
    let rowData = [];
    for (let col = 0; col < 4; col++) {
      if (row === 3 && col === 3) {
        rowData.push(0); // Empty space
      } else {
        rowData.push(row * 4 + col + 1);
      }
    }
    grid.push(rowData);
  }

  emptyPos = { x: 3, y: 3 };
}

function shuffleTiles() {
  // Use random swaps to create solvable puzzle
  let totalSwaps = 100;
  for (let i = 0; i < totalSwaps; i++) {
    let possibleMoves = getValidEmptyNeighbors();
    if (possibleMoves.length > 0) {
      let move = random(possibleMoves);
      swapTile(emptyPos.x, emptyPos.y, move.x, move.y);
    }
  }
}

function getValidEmptyNeighbors() {
  let neighbors = [];

  // Check all 4 directions from empty space
  if (emptyPos.y > 0) neighbors.push({ x: emptyPos.x, y: emptyPos.y - 1 }); // Top
  if (emptyPos.y < 3) neighbors.push({ x: emptyPos.x, y: emptyPos.y + 1 }); // Bottom
  if (emptyPos.x > 0) neighbors.push({ x: emptyPos.x - 1, y: emptyPos.y }); // Left
  if (emptyPos.x < 3) neighbors.push({ x: emptyPos.x + 1, y: emptyPos.y }); // Right

  return neighbors;
}

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
    }
  }
  return true;
}

function mousePressed() {
  let mx = int(mouseX / tileSize);
  let my = int(mouseY / tileSize);

  // Check if clicked tile is adjacent to empty space
  if (abs(mx - emptyPos.x) + abs(my - emptyPos.y) === 1 && grid[my][mx] !== 0) {
    swapTile(emptyPos.x, emptyPos.y, mx, my);
  } else if (checkWin()) {
    // Restart on click after winning
    initGrid();
    shuffleTiles();
  }
}

// Swipe detection for mobile devices
function touchStarted() {
  dragStartX = mouseX;
  dragStartY = mouseY;
  isDragging = true;
  return false; // Prevent default browser behavior
}

function touchEnded() {
  if (!isDragging) return;

  let dx = mouseX - dragStartX;
  let dy = mouseY - dragStartY;

  // Minimum swipe distance threshold
  const minSwipeDistance = 30;

  if (abs(dx) > abs(dy)) {
    // Horizontal swipe
    if (dx > minSwipeDistance) {
      handleSwipe('right');
    } else if (dx < -minSwipeDistance) {
      handleSwipe('left');
    }
  } else {
    // Vertical swipe
    if (dy > minSwipeDistance) {
      handleSwipe('down');
    } else if (dy < -minSwipeDistance) {
      handleSwipe('up');
    }
  }

  isDragging = false;
}

function handleSwipe(direction) {
  let moveX, moveY;

  switch(direction) {
    case 'up':
      moveX = emptyPos.x;
      moveY = emptyPos.y - 1;
      break;
    case 'down':
      moveX = emptyPos.x;
      moveY = emptyPos.y + 1;
      break;
    case 'left':
      moveX = emptyPos.x - 1;
      moveY = emptyPos.y;
      break;
    case 'right':
      moveX = emptyPos.x + 1;
      moveY = emptyPos.y;
      break;
  }

  // Validate and execute swipe move
  if (moveY >= 0 && moveY < 4 && moveX >= 0 && moveX < 4 && grid[moveY][moveX] !== 0) {
    swapTile(emptyPos.x, emptyPos.y, moveX, moveY);
  }
}

function touchMoved() {
  // Track drag for visual feedback (optional)
}
