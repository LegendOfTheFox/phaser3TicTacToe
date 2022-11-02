import 'phaser';

export default class RpgBattleSystem extends Phaser.Scene {
  constructor() {
    super('rpgBattleSystem');
  }

  init() {}

  preload() {
    this.load.image('battleBackground', 'assets/testBattleBackground01.png');
    this.load.atlas(
      'knight',
      'assets/rpgBattleSystem/knight.png',
      'assets/rpgBattleSystem/knight.json'
    );
  }

  create() {
    this.add.image(0, 0, 'battleBackground').setOrigin(0);

    for (var i = 0; i < 13; i++) {
      this.add.image(64 * i, 536, 'tiles', 1).setOrigin(0);
    }

    //  Our animations
    this.anims.create({
      key: 'guardStart',
      frames: this.anims.generateFrameNames('knight', {
        prefix: 'guard_start/frame',
        start: 0,
        end: 3,
        zeroPad: 4,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: 'guard',
      frames: this.anims.generateFrameNames('knight', {
        prefix: 'guard/frame',
        start: 0,
        end: 5,
        zeroPad: 4,
      }),
      frameRate: 8,
      repeat: 2,
    });

    this.anims.create({
      key: 'guardEnd',
      frames: this.anims.generateFrameNames('knight', {
        prefix: 'guard_end/frame',
        start: 0,
        end: 3,
        zeroPad: 4,
      }),
      frameRate: 8,
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('knight', {
        prefix: 'idle/frame',
        start: 0,
        end: 5,
        zeroPad: 4,
      }),
      frameRate: 8,
      repeat: -1,
    });

    var lancelot = this.add.sprite(200, 236, 'knight');

    lancelot.setOrigin(0.5, 1);
    lancelot.setScale(3);
    lancelot.play('idle');

    var text = this.add
      .text(400, 8, 'Click to play animation chain', { color: '#ffffff' })
      .setOrigin(0.5, 0);

    lancelot.on(
      Phaser.Animations.Events.ANIMATION_START,
      function (anim: { key: string }) {
        text.setText('Playing ' + anim.key);
      }
    );

    this.input.on(
      'pointerdown',
      function () {
        if (lancelot.anims.getName() === 'idle') {
          lancelot.playAfterRepeat('guardStart');
          lancelot.chain(['guard', 'guardEnd', 'idle']);
        }
      },
      this
    );
  }

  update() {}
}
