import 'phaser';
import MainMenu from './mainMenu';
import TicTacToe from './ticTacToe';
import RpgBattleSystem from './rpgBattleSystem/rpgBattleSystem';

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 800,
  height: 600,
  scene: [MainMenu, TicTacToe, RpgBattleSystem],
};

const game = new Phaser.Game(config);
