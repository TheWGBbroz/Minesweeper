var board;

const SPOT_SIZE = 32;
const ROWS = 16;
const COLS = 16;

function setup() {
	createCanvas(ROWS * SPOT_SIZE + 1, COLS * SPOT_SIZE + 1);

	createBoard();
}

function draw() {
	background(0);

	for(var r = 0; r < ROWS; r++) {
		var x = r * SPOT_SIZE;

		for(var c = 0; c < COLS; c++) {
			var spot = board[r][c];
			
			var y = c * SPOT_SIZE;

			if(spot.revealed) {
				fill(255);
				stroke(0);
				rect(x, y, SPOT_SIZE, SPOT_SIZE);

				if(spot.mine) {
					fill(0);
					stroke(0, 0);
					ellipse(x + SPOT_SIZE / 2, y + SPOT_SIZE / 2, SPOT_SIZE / 2, SPOT_SIZE / 2);
				}else if(spot.neighbors != 0) {
					fill(0);
					stroke(0, 0);
					textSize(SPOT_SIZE / 2);
					textAlign(CENTER, CENTER);
					text(spot.neighbors, x + SPOT_SIZE / 2, y + SPOT_SIZE / 2);
				}
			}else{
				fill(200);
				stroke(0);
				rect(x, y, SPOT_SIZE, SPOT_SIZE);

				if(spot.flag) {
					fill(255, 0, 0);
					stroke(0, 0);

					triangle(x + SPOT_SIZE / 4, y + 2, x + SPOT_SIZE * 3 / 4, y + SPOT_SIZE / 4, x + SPOT_SIZE / 4, y + SPOT_SIZE / 2);

					stroke(255, 0, 0);
					strokeWeight(2);
					line(x + SPOT_SIZE / 4 + 1, y + SPOT_SIZE / 2, x + SPOT_SIZE / 4 + 1, y + SPOT_SIZE - 4);
					strokeWeight(1);
				}
			}
		}
	}
}

function mousePressed() {
	if(mouseButton == "left") {
		var spot = board[floor(mouseX / SPOT_SIZE)][floor(mouseY / SPOT_SIZE)];
		if(spot && !spot.flag) {
			spot.reveal();
		}
	}else if(mouseButton == "center") {
		var spot = board[floor(mouseX / SPOT_SIZE)][floor(mouseY / SPOT_SIZE)];
		spot.flag = !spot.flag;
	}
}

function gameOver() {
	for(var r = 0; r < ROWS; r++) {
		for(var c = 0; c < COLS; c++) {
			board[r][c].revealed = true;
		}
	}
}

function createBoard() {
	board = new Array(ROWS);

	for(var r = 0; r < ROWS; r++) {
		board[r] = new Array(COLS);
		for(var c = 0; c < COLS; c++) {
			board[r][c] = new Spot(r, c);
		}
	}

	for(var r = 0; r < ROWS; r++) {
		for(var c = 0; c < COLS; c++) {
			board[r][c].calculateNeighbors();
		}
	}
}

function Spot(row, col) {
	this.row = row;
	this.col = col;
	this.mine = random() < 0.1;
	this.revealed = false;
	this.flag = false;
	this.neighbors;
}

Spot.prototype.calculateNeighbors = function() {
	this.neighbors = 0;

	for(var dr = -1; dr <= 1; dr++) {
		var row = this.row + dr;
		if(row < 0 || row >= ROWS) continue;

		for(var dc = -1; dc <= 1; dc++) {
			if(dr == 0 && dc == 0) continue;

			var col = this.col + dc;
			if(col < 0 || col >= COLS) continue;

			if(board[row][col].mine)
				this.neighbors++;
		}
	}
}

Spot.prototype.reveal = function() {
	if(this.revealed) return;

	this.revealed = true;

	if(!this.mine) {
		if(this.neighbors == 0) {
			for(var dr = -1; dr <= 1; dr++) {
				var row = this.row + dr;
				if(row < 0 || row >= ROWS) continue;

				for(var dc = -1; dc <= 1; dc++) {
					if(dr == 0 && dc == 0) continue;

					var col = this.col + dc;
					if(col < 0 || col >= COLS) continue;

					board[row][col].reveal();
				}
			}
		}
	}else{
		gameOver();
	}
}