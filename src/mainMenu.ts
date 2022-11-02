import 'phaser';

export default class MainMenu extends Phaser.Scene {
  cursors: any;
  private buttons: Phaser.GameObjects.Image[] = [];
  private selectedButtonIndex = 0;
  private buttonSelector!: Phaser.GameObjects.Image;

  constructor() {
    super('mainMenu');
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image('glass-panel', 'assets/glassPanel.png');
    this.load.image('cursor-hand', 'assets/cursor_hand.png');
    this.load.image('mainMenuBackground', 'assets/BasicMainMenuScene.png');
  }

  create() {
    this.add.image(0, 0, 'mainMenuBackground').setOrigin(0);
    const { width, height } = this.scale;

    // Play button
    const playButton = this.add
      .image(width * 0.5, height * 0.6, 'glass-panel')
      .setDisplaySize(150, 50);

    this.add.text(playButton.x, playButton.y, 'Tic Tac Toe').setOrigin(0.5);

    // Settings button
    const rpgBattleSystemButton = this.add
      .image(
        playButton.x,
        playButton.y + playButton.displayHeight + 10,
        'glass-panel'
      )
      .setDisplaySize(150, 50);

    this.add
      .text(rpgBattleSystemButton.x, rpgBattleSystemButton.y, 'Battle System')
      .setOrigin(0.5);

    // Credits button
    const creditsButton = this.add
      .image(
        rpgBattleSystemButton.x,
        rpgBattleSystemButton.y + rpgBattleSystemButton.displayHeight + 10,
        'glass-panel'
      )
      .setDisplaySize(150, 50);

    this.add.text(creditsButton.x, creditsButton.y, 'Credits').setOrigin(0.5);

    this.buttons.push(playButton);
    this.buttons.push(rpgBattleSystemButton);
    this.buttons.push(creditsButton);

    this.buttonSelector = this.add.image(0, 0, 'cursor-hand');

    this.selectButton(0);

    playButton.on('selected', () => {
      console.log('play');
      this.scene.start('ticTacToe');
    });

    rpgBattleSystemButton.on('selected', () => {
      console.log('battle system');
      this.scene.start('rpgBattleSystem');
    });

    creditsButton.on('selected', () => {
      console.log('credits');
    });
  }

  selectButton(index: number) {
    const currentButton = this.buttons[this.selectedButtonIndex];

    // set the current selected button to a white tint
    currentButton.setTint(0xffffff);

    const button = this.buttons[index];

    // set the newly selected button to a green tint
    button.setTint(0x66ff7f);

    // move the hand cursor to the right edge
    this.buttonSelector.x = button.x + button.displayWidth * 0.5;
    this.buttonSelector.y = button.y + 10;

    // store the new selected index
    this.selectedButtonIndex = index;
  }

  selectNextButton(change = 1) {
    let index = this.selectedButtonIndex + change;

    // wrap the index to the front or end of array
    if (index >= this.buttons.length) {
      index = 0;
    } else if (index < 0) {
      index = this.buttons.length - 1;
    }

    this.selectButton(index);
  }

  confirmSelection() {
    // get the currently selected button
    const button = this.buttons[this.selectedButtonIndex];

    // emit the 'selected' event
    button.emit('selected');
  }

  update() {
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!);
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!);
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(
      this.cursors.space!
    );

    if (upJustPressed) {
      this.selectNextButton(-1);
    } else if (downJustPressed) {
      this.selectNextButton(1);
    } else if (spaceJustPressed) {
      this.confirmSelection();
    }
  }
}
