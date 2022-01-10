import * as Phaser from "phaser";
import {getResolution, getConfig} from '../Util/Util'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
    console.log("PreloadScene");
  }

  preload(): void {
    console.log("preload");
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    let self = this;
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(getResolution().width / 2 - 160, getResolution().height / 2 - 25, 320, 50);
    this.load.on('progress', function(value) {
      console.log(value);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(getResolution().width / 2 - 150, getResolution().height / 2 - 15, 300 * value, 30);
    });
    this.load.on('fileprogress', function (file) {
      console.log(file.src)
    })
    this.load.on('complete', () => {
      console.log('complete');
      self.scene.start("GameScene");
    })
    this.load.path = "src/Assets/";
    this.load.image("crystal", "crystal.png");
    this.load.image("dirt", "dirt.png");
    this.load.image("grass", "grass.png");
    this.load.image("obstacle", "obstacle.png");
    this.load.image("mountain", "parallaxMountain.png");
    this.load.image("powerup", "powerup.png");
    this.load.image("shopee", "shopee.png");
    this.load.image("saw", "saw.png");
    this.load.image("sky", "sky.jpeg");
    this.load.spritesheet("runner", "runner.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.audio('jump', "sounds/jump.wav");
    this.load.audio('score', "sounds/score.wav");
    this.load.audio('bg', "sounds/bg.wav");
    this.load.audio('collision', "sounds/collision.wav");
  }

  create(): void {
    console.log("created");
  }
}
