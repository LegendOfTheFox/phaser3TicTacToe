import 'phaser';

enum GameState {
  PLAYING = 0,
  END = 1,
}

interface TilePosition {
  x: number;
  y: number;
}

export default class TicTacToe extends Phaser.Scene {
  [x: string]: any;
  boardOffsetX: number;
  boardOffsetY: number;
  tileWidth: number;
  tileHeight: number;
  currentPlayerTurn: number;
  gameBoard: number[][];
  boardTileImages: [any, any, any][];
  score: { player1: number; player2: number };
  playerScoreImage: Phaser.GameObjects.Text[];
  gameState: GameState;
  testParticle: any;

  constructor() {
    super('ticTacToe');

    this.boardOffsetX = 250;
    this.boardOffsetY = 175;
    this.tileWidth = 64;
    this.tileHeight = 64;
    this.currentPlayerTurn = 1;
    this.score = {
      player1: 0,
      player2: 0,
    };
    this.playerScoreImage = [];

    this.testParticle = null;

    this.gameState = GameState.PLAYING;

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

  setGameState(state: GameState): void {
    this.gameState = state;
  }

  getGameState(): GameState {
    return this.gameState;
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

    this.load.image('fire', 'assets/muzzleflash3.png');
  }

  create(): void {
    this.add.shader('RGB Shift Field', 0, 0, 800, 600).setOrigin(0);

    this.testParticle = this.add.particles('fire');

    this.drawBoard();
    this.createScores();
  }

  getCurrentPlayerTurn(): number {
    return this.currentPlayerTurn;
  }

  toggleCurrentPlayerTurn(): void {
    if (this.currentPlayerTurn == 1) {
      this.currentPlayerTurn = 2;
    } else {
      this.currentPlayerTurn = 1;
    }
  }

  createScores(): void {
    const textConfig = {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: '32px',
    };

    this.setPlayerScoreImage(textConfig);
  }

  setPlayerScoreImage(textConfig: { fontFamily: string; fontSize: string }) {
    this.playerScoreImage = [
      this.createScoreImage(
        { x: 10, y: 10 },
        'Player 1: ' + this.score.player1,
        textConfig
      ),
      this.createScoreImage(
        { x: 600, y: 10 },
        'Player 2: ' + this.score.player2,
        textConfig
      ),
    ];
  }

  createScoreImage(
    coordinates: { x: any; y: any },
    playerString: string | string[],
    textConfig: Phaser.Types.GameObjects.Text.TextStyle | undefined
  ) {
    return this.add.text(
      coordinates.x,
      coordinates.y,
      playerString,
      textConfig
    );
  }

  drawScores(): void {
    this.playerScoreImage[0].setText('Player 1: ' + this.score.player1);
    this.playerScoreImage[1].setText('Player 2: ' + this.score.player2);
  }

  drawBoard(): void {
    for (let i = 1; i < 4; i++) {
      for (let s = 1; s < 4; s++) {
        const tile = this.add
          .image(
            this.boardOffsetX + this.tileWidth * i,
            this.boardOffsetY + this.tileHeight * s,
            this.getSquareImage(this.gameBoard[i - 1][s - 1])
          )
          .setInteractive();

        const row = i - 1;
        const column = s - 1;

        this.setTileData(tile, { x: row, y: column });
        this.setTileImage(tile, { x: row, y: column });
        tile.on('pointerdown', this.onClick);
      }
    }
  }

  setTileData(image: any, position: TilePosition) {
    image.setData('boardPosition', position);
    image.setData('updateGameState', this.updateGameState);
  }

  setTileImage(image: any, tilePosition: TilePosition): void {
    this.boardTileImages[tilePosition.x][tilePosition.y] = image;
  }

  onClick(e: any) {
    const image = this;

    const tilePosition = image.getData('boardPosition');
    const updateGameState: Function = image['getData']('updateGameState');

    const tileScreenPosition = { x: image['x'], y: image['y'] };

    updateGameState(tilePosition, tileScreenPosition);
  }

  updateGameState(
    tilePosition: TilePosition,
    tileScreenPosition: { x: any; y: any }
  ): void {
    if (this.getGameState() == GameState.END) {
      return;
    }

    this.testParticle.createEmitter({
      alpha: { start: 1, end: 0 },
      scale: { start: 0.5, end: 2.5 },
      //tint: { start: 0xff945e, end: 0xff945e },
      speed: 20,
      accelerationY: -300,
      angle: { min: -85, max: -95 },
      rotate: { min: -180, max: 180 },
      lifespan: { min: 1000, max: 1100 },
      //blendMode: 'NORMAL',
      frequency: 50,
      maxParticles: 10,
      x: tileScreenPosition.x,
      y: tileScreenPosition.y,
    });

    this.testParticle.setDepth(2);

    const tileClicked = this.gameBoard[tilePosition.x][tilePosition.y];

    if (!this.checkIfTileIsValid(tileClicked)) {
      console.warn('tile is invalid');
      return;
    }

    const currentPlayer = this.getCurrentPlayerTurn();
    this.updateTile(tilePosition, currentPlayer);

    const currentPlayerWon = this.checkIfPlayerWon(currentPlayer);
    const gameIsADraw = this.checkIfGameIsADraw();

    if (currentPlayerWon) {
      console.log('Player ' + currentPlayer + ' won!');
      this.updateGamesWon(currentPlayer);
      this.newGame();
    } else if (gameIsADraw) {
      console.log('Draw');
      this.newGame();
    } else {
      this.toggleCurrentPlayerTurn();
    }
  }

  newGame(): void {
    this.setGameState(GameState.END);
    setTimeout(() => {
      this.resetBoard();
      this.setGameState(GameState.PLAYING);
    }, 2000);
  }

  checkIfGameIsADraw(): boolean {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let s = 0; s < this.gameBoard[i].length; s++) {
        if (this.gameBoard[i][s] == 0) {
          return false;
        }
      }
    }

    return true;
  }

  updateTile(tilePosition: TilePosition, tileValue: number): void {
    this.updateTileValue(tilePosition, tileValue);
    this.updateTileImage(tilePosition, tileValue);
  }

  updateTileValue(tilePosition: TilePosition, tileValue: number): void {
    this.gameBoard[tilePosition.x][tilePosition.y] = tileValue;
  }

  updateTileImage(tilePosition: TilePosition, tileValue: number): void {
    const image = this.boardTileImages[tilePosition.x][tilePosition.y];
    image['setTexture'](this.getSquareImage(tileValue));
  }

  updateGamesWon(currentPlayer: number): void {
    if (currentPlayer == 1) {
      this.score.player1++;
    } else {
      this.score.player2++;
    }
  }

  resetBoard(): void {
    this.setBoardDefaults();
    this.resetBoardTileImages();
  }

  setBoardDefaults(): void {
    this.gameBoard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }

  resetBoardTileImages(): void {
    for (let i = 0; i < 3; i++) {
      for (let s = 0; s < 3; s++) {
        let image = this.boardTileImages[i][s];
        image['setTexture']('blackBorderSquare');
      }
    }
  }

  checkIfTileIsValid(tileValue: number): boolean {
    if (tileValue == 0) {
      return true;
    }

    return false;
  }

  checkIfPlayerWon(currentPlayer: number): boolean {
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

  getSquareImage(currentValue: number) {
    if (currentValue == 2) {
      return 'o';
    } else if (currentValue == 1) {
      return 'x';
    } else {
      return 'blackBorderSquare';
    }
  }

  update(time: number, delta: number): void {
    this.drawScores();
  }
}
