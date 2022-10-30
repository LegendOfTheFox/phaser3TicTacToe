import ticTacToe from '../src/ticTacToe';
import 'jest-canvas-mock';

let newGame: ticTacToe;

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
});
