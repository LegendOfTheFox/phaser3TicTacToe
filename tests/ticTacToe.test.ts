import ticTacToe from '../src/ticTacToe';
import 'jest-canvas-mock';

let newGame: ticTacToe;

const player1WinningGameBoard = [
  [0, 2, 0],
  [2, 1, 0],
  [1, 1, 1],
];

const player2WinningGameBoard = [
  [2, 2, 2],
  [2, 1, 0],
  [1, 0, 1],
];

const lateralWinningGameBoard = [
  [0, 2, 0],
  [2, 1, 0],
  [1, 1, 1],
];

const verticalWinningGameBoard = [
  [2, 2, 0],
  [2, 1, 0],
  [2, 0, 1],
];

const diagonalWinningGameBoard = [
  [2, 2, 0],
  [1, 2, 1],
  [2, 0, 2],
];

const drawGameBoard = [
  [2, 2, 1],
  [1, 1, 2],
  [2, 2, 1],
];

const gameInProgress = [
  [2, 2, 1],
  [1, 0, 2],
  [2, 2, 0],
];

const emptyGameBoard = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

beforeAll(() => {
  newGame = new ticTacToe();
});

describe('testing Tic Tac Toe', () => {
  test('default game state should be running', () => {
    const gameState = newGame.getGameState();

    expect(gameState).toBe(0);
  });

  test('the game transitions to end after a new state', () => {
    newGame.setGameState(1);
    const gameState = newGame.getGameState();

    expect(gameState).toBe(1);
  });

  test('returns the current players turn', () => {
    const currentPlayerTurn = newGame.getCurrentPlayerTurn();

    expect(currentPlayerTurn).toBe(1);
  });

  test('toggles the current players turn', () => {
    newGame.toggleCurrentPlayerTurn();
    const currentPlayerTurn = newGame.getCurrentPlayerTurn();

    expect(currentPlayerTurn).toBe(2);
  });

  test('toggles the current players turn from player 2 to 1', () => {
    newGame.currentPlayerTurn = 2;
    newGame.toggleCurrentPlayerTurn();
    const currentPlayerTurn = newGame.getCurrentPlayerTurn();

    expect(currentPlayerTurn).toBe(1);
  });

  test('sets the board back to defaults', () => {
    newGame.gameBoard = [
      [0, 2, 0],
      [2, 1, 0],
      [0, 0, 1],
    ];

    newGame.setBoardDefaults();

    expect(newGame.gameBoard).toStrictEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  test('sets the board images back to defaults', () => {
    newGame.boardTileImages = [
      [2, 2, 2],
      [2, 2, 2],
      [2, 2, 2],
    ];

    const mockFunc = (newGame.setDefaultTileImage = jest.fn());

    newGame.resetBoardTileImages();

    expect(mockFunc.mock.calls.length).toBe(9);
  });

  test('updates games won for the player 1', () => {
    newGame.score.player1 = 0;
    newGame.score.player2 = 0;

    newGame.updateGamesWon(1);

    expect(newGame.score.player1).toBe(1);
  });

  test('updates games won for the passed in player', () => {
    newGame.score.player1 = 0;
    newGame.score.player2 = 0;

    newGame.updateGamesWon(2);

    expect(newGame.score.player2).toBe(1);
  });

  test('no update if the player is invalid', () => {
    newGame.score.player1 = 0;
    newGame.score.player2 = 0;

    newGame.updateGamesWon(3);

    expect(newGame.score.player1).toBe(0);
    expect(newGame.score.player2).toBe(0);
  });

  test('true if the tile is valid', () => {
    const validTile = newGame.checkIfTileIsValid(0);

    expect(validTile).toBe(true);
  });

  test('false if the tile is invalid', () => {
    const validTile = newGame.checkIfTileIsValid(2);

    expect(validTile).toBe(false);
  });

  test('player 1 can win a game', () => {
    newGame.gameBoard = player1WinningGameBoard;

    const wonGame = newGame.checkIfPlayerWon(1);

    expect(wonGame).toBe(true);
  });

  test('player 2 cant win a game without a proper sequence', () => {
    newGame.gameBoard = player1WinningGameBoard;

    const wonGame = newGame.checkIfPlayerWon(2);

    expect(wonGame).toBe(false);
  });

  test('player 2 can win a game', () => {
    newGame.gameBoard = player2WinningGameBoard;

    const wonGame = newGame.checkIfPlayerWon(2);

    expect(wonGame).toBe(true);
  });

  test('player can win with a lateral sequence', () => {
    newGame.gameBoard = lateralWinningGameBoard;

    const wonGame = newGame.checkIfPlayerWon(1);

    expect(wonGame).toBe(true);
  });

  test('player can win with a vertical sequence', () => {
    newGame.gameBoard = verticalWinningGameBoard;

    const wonGame = newGame.checkIfPlayerWon(2);

    expect(wonGame).toBe(true);
  });

  test('player can win with a diagnoal sequence', () => {
    newGame.gameBoard = diagonalWinningGameBoard;

    const wonGame = newGame.checkIfPlayerWon(2);

    expect(wonGame).toBe(true);
  });

  test('draw gameboard has no winners', () => {
    newGame.gameBoard = drawGameBoard;

    const wonGamePlayer1 = newGame.checkIfPlayerWon(1);
    const wonGamePlayer2 = newGame.checkIfPlayerWon(2);

    expect(wonGamePlayer1).toBe(false);
    expect(wonGamePlayer2).toBe(false);
  });

  test('returns true if the game is a draw', () => {
    newGame.gameBoard = drawGameBoard;

    const isDraw = newGame.checkIfGameIsADraw();

    expect(isDraw).toBe(true);
  });

  test('returns false if the game isnt over', () => {
    newGame.gameBoard = gameInProgress;

    const isDraw = newGame.checkIfGameIsADraw();

    expect(isDraw).toBe(false);
  });

  test('returns the default if no player is given', () => {
    const imageString = newGame.getSquareImage(5);
    expect(imageString).toBe('blackBorderSquare');
  });

  test('returns the x for player 1', () => {
    const imageString = newGame.getSquareImage(1);
    expect(imageString).toBe('x');
  });

  test('returns the o for player 2', () => {
    const imageString = newGame.getSquareImage(2);
    expect(imageString).toBe('o');
  });

  test('a New Game completely resets the game board', async () => {
    newGame.gameBoard = gameInProgress;
    await newGame.newGame();
    expect(newGame.gameBoard).toStrictEqual(emptyGameBoard);
  });
});
