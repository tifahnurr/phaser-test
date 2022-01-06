import * as Phaser from 'phaser';

export default class ScoreText extends Phaser.GameObjects.Text {
  constructor(scene:Phaser.Scene) {
    super(scene, 300, 10, '', { color: 'white', fontSize: '28px' })
    scene.add.existing(this)
    this.setOrigin(0)
  }

  update(score) {
    this.setText(`Score: ${Math.floor(score)}`)
  }
}
