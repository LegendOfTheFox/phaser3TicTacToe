import 'phaser';

export default class TicTacToe extends Phaser.Scene {
  boardOffsetX: number;
  boardOffsetY: number;
  tileWidth: number;
  tileHeight: number;
  currentPlayerTurn: number;
  gameBoard: number[][];
  boardTileImages: {};

  constructor() {
    super('ticTacToe');

    this.boardOffsetX = 250;
    this.boardOffsetY = 175;
    this.tileWidth = 64;
    this.tileHeight = 64;
    this.currentPlayerTurn = 1;

    this.updateGameState = this.updateGameState.bind(this);

    this.gameBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    this.boardTileImages = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('libs', 'assets/libs.png');

    this.load.image('emptySquare', 'assets/1bitblock0.png');
    this.load.image('blackBorderSquare', 'assets/1bitblock2.png');

    this.load.image('x', 'assets/1bitblock1.png');
    this.load.image('o', 'assets/1bitblock3.png');

    this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
    this.load.glsl('stars', 'assets/starfields.glsl.js');
  }

  create() {
    this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

    this.drawBoard();
  }

  getCurrentPlayerTurn() {
    return this.currentPlayerTurn;
  }

  toggleCurrentPlayerTurn() {
    if (this.currentPlayerTurn == 1) {
      this.currentPlayerTurn = 2;
    } else {
      this.currentPlayerTurn = 1;
    }
  }

  drawBoard(): void {
    for (let i = 1; i < 4; i++) {
      for (let s = 1; s < 4; s++) {
        let square = this.add
          .image(
            this.boardOffsetX + this.tileWidth * i,
            this.boardOffsetY + this.tileHeight * s,
            this.getSquareImage(this.gameBoard[i - 1][s - 1])
          )
          .setInteractive();

        const row = i - 1;
        const column = s - 1;

        square.setData('boardPosition', { x: row, y: column });
        square.setData('updateGameState', this.updateGameState);
        square['name'] = 'test';

        this.boardTileImages[row][column] = square;

        square.on('pointerdown', this.onClick);
      }
    }
  }

  onClick(e: any) {
    let image = this;
    console.log('image?', image, image['name']);

    let tilePosition = image['getData']('boardPosition');
    let updateGameState = image['getData']('updateGameState');

    console.log('tilePosition that was clicked', tilePosition);

    updateGameState(tilePosition);
  }

  updateTileImage(image) {
    image['setTexture']('x');
  }

  updateGameState(tilePosition) {
    const tileClicked = this.gameBoard[tilePosition.x][tilePosition.y];

    if (!this.checkIfTileIsValid(tileClicked)) {
      console.warn('tile is invalid');
      return;
    }

    const currentPlayer = this.getCurrentPlayerTurn();

    this.gameBoard[tilePosition.x][tilePosition.y] = currentPlayer;

    let image = this.boardTileImages[tilePosition.x][tilePosition.y];
    image['setTexture'](this.getSquareImage(currentPlayer));

    const currentPlayerWon = this.checkIfPlayerWon(currentPlayer);
    console.log('curentPlayerWon?', currentPlayerWon);
    if (currentPlayerWon) {
      console.log('Player ' + currentPlayer + ' won!, resetting board');
    } else {
      this.toggleCurrentPlayerTurn();
    }
  }

  checkIfTileIsValid(tileValue) {
    if (tileValue == 0) {
      return true;
    }

    return false;
  }

  checkIfPlayerWon(currentPlayer) {
    let result = false;
    // check rows
    for (let i = 0; i < 3; i++) {
      if (
        this.gameBoard[i][0] == currentPlayer &&
        this.gameBoard[i][1] == currentPlayer &&
        this.gameBoard[i][2] == currentPlayer
      ) {
        result = true;
      }
    }
    // check columns
    for (let i = 0; i < 3; i++) {
      if (
        this.gameBoard[0][i] == currentPlayer &&
        this.gameBoard[1][i] == currentPlayer &&
        this.gameBoard[2][i] == currentPlayer
      ) {
        result = true;
      }
    }
    // check diagonals
    if (
      this.gameBoard[0][0] == currentPlayer &&
      this.gameBoard[1][1] == currentPlayer &&
      this.gameBoard[2][2] == currentPlayer
    ) {
      result = true;
    }

    return result;
  }

  updateBoardPosition() {
    console.log('gameboard test', this.gameBoard);
  }

  getSquareImage(currentValue: number) {
    if (currentValue == 2) {
      return 'o';
    } else if (currentValue == 1) {
      return 'x';
    } else {
      return 'blackBorderSquare';
    }
  }

  update() {}

  clearBoard() {}
}
