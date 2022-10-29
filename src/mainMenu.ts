import 'phaser';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('mainMenu');
  }

  create() {
    this.add.text(20, 20, 'Main Menu');

    setTimeout(() => {
      this.scene.start('ticTacToe');
    }, 2000);
  }
}
