import * as Phaser from "phaser";
import Shopee from "../Object/Shopee"
import FpsText from "../Object/FpsText";
import Player from "../Object/Player";
import Star from "../Object/Star";
import Saw from "../Object/Saw";
import ScoreText from "../Object/ScoreText";
import Obstacle from "../Object/Obstacle";

import {getResolution, getConfig} from '../Util/Util'

export default class GameScene extends Phaser.Scene {

  private fpsText:FpsText;
  private player:Player;
  private isSpawningObject:Boolean;
  private scoreText:ScoreText;
  private platform;
  private score = 0;
  private gameOver = false;
  private background;
  private ground;
  private dirt;
  private sky;
  private scoreInterval;
  private audio = {jump: null, score: null, collision: null, bg: null};
  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void 
  {
    this.sky = this.add.tileSprite(getResolution().width / 2, getResolution().height / 2, getResolution().width, getResolution().height, 'sky');
    console.log("GameScene");
    this.audio.jump = this.sound.add('jump');
    this.audio.score = this.sound.add('score');
    this.audio.bg = this.sound.add("bg");
    this.audio.collision = this.sound.add('collision');
    this.audio.bg.loop = true;
  }

  create(): void 
  {
    this.score = 0;
    this.gameOver = false;
    this.physics.resume();
    this.background = this.add.tileSprite(0, 600, 0, 0, "mountain"); 
    this.platform = this.physics.add.staticGroup();
    for (let i = 0; i < getResolution().width * 5; i += 50) {
        this.platform.create(i, getResolution().height * 3 / 4, 'grass');
    }
    this.fpsText = new FpsText(this);
    this.scoreText = new ScoreText(this);
    this.player = new Player(this, this.cameras.main.width/3, 700);
    this.ground = this.add.tileSprite(0, getResolution().height * 3 / 4 - 30, 1000, 50, 'grass').setOrigin(0, 0);
    this.dirt = this.add.tileSprite(0, getResolution().height * 3 / 4 + 20, 1000, 280, 'dirt').setOrigin(0, 0);
    this.scoreInterval = setInterval(() => {
      this.score += 100;
    }, 3000)
    if (!this.audio.bg.isPlaying) {
      this.audio.bg.play()
    }
  }

  update(): void 
  {
    this.physics.add.collider(this.player, this.platform);
    this.fpsText.update();
    this.scoreText.update(this.score);
    let cursors = this.input.keyboard.createCursorKeys();
    let mouse = this.input.activePointer;
    if (!this.gameOver) {
      
      this.ground.tilePositionX += 4;
      this.dirt.tilePositionX += 4;
      this.background.tilePositionX += 0.5;
      this.sky.tilePositionX += 0.1;
      
      if ((cursors.up.isDown || cursors.space.isDown || mouse.isDown ) && !this.player.isJumping) {
        this.player.setVelocityY(-300);
        this.player.anims.play('jump');
        this.player.setIsJumping(true);
        this.audio.jump.play();
        setTimeout(() => {
          this.player.setIsJumping(false);
        }, 1500);
      }
      if (!this.player.anims.isPlaying) {
        this.player.anims.play("run");
      }
      if (!this.isSpawningObject) {
        this.isSpawningObject = true;
        setTimeout(() => {
          let randomObj = Math.floor(Math.random() * (2 - 0 + 1) );
          switch (randomObj) {
            case 0:
              let star = new Star(this);
              this.physics.add.overlap(this.player, star, this.collectStar, null, this);
              break;
            case 1:
              let obstacle = new Obstacle(this);
              this.physics.add.overlap(this.player, obstacle, this.collided, null, this);
              break;
            case 2:
              let saw = new Saw(this);
              this.physics.add.overlap(this.player, saw, this.collided, null, this);
              break;
          }
          this.isSpawningObject = false;
        }, Math.floor(Math.random() * (8000 - 4000 + 1) ) + 3000);
      }
    }
    
    // this.background[0].setTilePosition(this.background[0].x + 100, this.background[0].y);
  }
  collectStar(_, star): void {
    this.score += 50;
    console.log(this.score);
    star.destroy();
    this.audio.score.play();
  }
  collided(player, obstacle): void {
    this.audio.collision.play();
    this.gameOver = true;
    this.physics.pause();
    this.player.anims.stop();
    clearInterval(this.scoreInterval);
    this.input.keyboard.on('keydown', () => {
      this.audio.bg.stop();
      this.scene.start('GameScene');
    })
    this.input.on("pointerdown", () => {
      this.audio.bg.stop();
      this.scene.start('GameScene');
    })
  }
}
