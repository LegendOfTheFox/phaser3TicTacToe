import ticTacToe from '../src/ticTacToe';
import 'jest-canvas-mock';

describe('testing Tic Tac Toe', () => {
  test('default game state should be running', () => {
    let newGame = new ticTacToe();

    let gameState = newGame.getGameState();

    expect(gameState).toBe(0);
  });
});
