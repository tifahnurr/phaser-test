import * as Phaser from "phaser";
import Shopee from "../Object/Shopee"
import FpsText from "../Object/FpsText";
import Player from "../Object/Player";
import Star from "../Object/Star";
import Saw from "../Object/Saw";
import ScoreText from "../Object/ScoreText";
import Obstacle from "../Object/Obstacle";
import StarPool from "../Object/StarPool";
import ObstaclePool from "../Object/ObstaclePool";

import {getResolution, getConfig} from '../Util/Util'

export default class GameScene extends Phaser.Scene {

  private fpsText:FpsText;
  private player:Player;
  private isSpawningObject:Boolean;
  private scoreText:ScoreText;
  private platform;
  private gameOver = false;
  private background = [];
  private ground;
  private dirt;
  private sky;
  private starPool;
  private obstaclePool;
  private sawPool;
  private gameOverText;

  private audio = {jump: null, score: null, collision: null, bg: null};
  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void 
  {
    this.sky = this.add.tileSprite(getResolution().width / 2, getResolution().height / 2, getResolution().width, getResolution().height, 'sky');
    console.log("yey");
    this.audio.jump = this.sound.add('jump');
    this.audio.score = this.sound.add('score');
    this.audio.bg = this.sound.add("bg");
    this.audio.collision = this.sound.add('collision');
    this.audio.bg.loop = true;
    while (this.background.length) {
      this.background.pop();
    }
    this.background.push(this.add.tileSprite(getResolution().width / 2, 600, 0, 0, "mountain"));
    this.background.push(this.add.tileSprite(getResolution().width / 2, 650, 0, 0, "mountain").setTint(0xdddddd).setScale(0.8)); 
    this.background.push(this.add.tileSprite(getResolution().width / 2, 750, 0, 0, "mountain").setTint(0xaaaaaa).setScale(0.6));
  }

  create(): void 
  {
    this.gameOver = false;
    this.physics.resume();
    this.time.timeScale = 1;
    this.isSpawningObject = false;
    this.platform = this.physics.add.staticGroup();
    for (let i = 0; i < getResolution().width * 5; i += 50) {
        this.platform.create(i, getResolution().height * 3 / 4, 'grass');
    }
    this.fpsText = new FpsText(this);
    this.scoreText = new ScoreText(this);
    this.player = new Player(this, this.cameras.main.width/3, 700);
    this.ground = this.add.tileSprite(0, getResolution().height * 3 / 4 - 30, 1000, 50, 'grass').setOrigin(0, 0);
    this.dirt = this.add.tileSprite(0, getResolution().height * 3 / 4 + 20, 1000, 280, 'dirt').setOrigin(0, 0);
    this.physics.add.collider(this.player, this.platform);
    this.starPool = new StarPool(this.game, this, this.player, this.audio.score);
    this.obstaclePool = new ObstaclePool(this.game, this, this.player, this.audio.collision);
    this.sawPool = new ObstaclePool(this.game, this, this.player, this.audio.collision);
    this.time.addEvent({
      delay: 3000, loop: true, 
      callback: () => {
        this.scoreText.add(100);
      }
    });
 
    if (!this.audio.bg.isPlaying) {
      this.audio.bg.play()
    }
  }

  update(): void 
  {
    this.fpsText.update();
    this.scoreText.update();
    let cursors = this.input.keyboard.createCursorKeys();
    let mouse = this.input.activePointer;
    if (!this.gameOver) {
      
      this.ground.tilePositionX += 4;
      this.dirt.tilePositionX += 4;
      this.background.forEach((background, index) => {
        background.tilePositionX += (index * 0.5) + 0.05;
      });
      this.sky.tilePositionX += 0.03;
      
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
        
        this.time.addEvent({
          delay: (Math.floor(Math.random() * (3000 - 1000 + 1) ) + 1000), loop: false, 
          callback: () => {
            let randomObj = Phaser.Math.Between(0, 2);
            switch (randomObj) {
              case 0:
                this.starPool.spawn(Star);
                // this.spawnStar();
                break;
              case 1:
                this.obstaclePool.spawn(Obstacle);
                break;
              case 2:
                this.sawPool.spawn(Saw);
                break;
            }
            this.isSpawningObject = false;
          }
        });
      }
    }
  }
  
  collided(): void {
    console.log("game over");
    this.gameOver = true;
    this.time.timeScale = 0;
    this.player.anims.stop();
    let gameOverText = this.add.text(getResolution().width / 2, getResolution().height / 2, 'GAME OVER', { fontSize: '32px', color: "#fffff"});
    gameOverText.setOrigin(0.5);
    this.input.keyboard.on('keydown', () => {
      this.audio.bg.stop();
      this.scene.start('GameScene');
    })
    this.input.on("pointerdown", () => {
      this.audio.bg.stop();
      this.scene.start('GameScene');
    })
  }

  addScore(addition): void {
    this.scoreText.add(addition);
  }
}
