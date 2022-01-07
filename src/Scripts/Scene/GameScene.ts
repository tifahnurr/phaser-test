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
  private gameOver = false;
  private background = [];
  private ground;
  private dirt;
  private sky;
  private scoreInterval;
  private starPool;
  private starGroup;
  private obstaclePool;
  private obstacleGroup;
  private sawPool;
  private sawGroup;

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
    this.starPool = this.add.group({
      removeCallback: function(star){
          star.scene.starGroup.add(star)
      }});
    this.starGroup = this.add.group({
      removeCallback: function(star){
          star.scene.starPool.add(star)
      }});
    // this.scoreInterval = setInterval(() => {
    //   this.scoreText.add(100);
    // }, 3000)
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
                this.spawnStar();
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
          }
        });
      }
    }
    
    // this.background[0].setTilePosition(this.background[0].x + 100, this.background[0].y);
  }
  collectStar(_, star): void {
    if (!star.isCollided) {
      star.kill();
      this.scoreText.add(50);
      // console.log(this.score);
      this.starGroup.killAndHide(star);
      this.starGroup.remove(star);
      this.audio.score.play();
    }
  }
  collided(player, obstacle): void {
    if (!obstacle.isCollided) {
      obstacle.kill();
      this.audio.collision.play();
      this.gameOver = true;
      this.time.timeScale = 0;
      this.player.anims.stop();
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
  spawnStar(): void {
    console.log("spawn star");
    console.log(this.starPool.getLength());
    if (this.starPool.getLength()) {
      console.log("recycle star");
      let star = this.starPool.getFirst();
      star.x = getResolution().width + 50;
      // coin.y = posY - 96;
      star.alpha = 1;
      star.active = true;
      star.visible = true;
      star.reset();
      this.starPool.remove(star);
    } else {
      console.log("create new star");
        let star = new Star(this);
        star.setImmovable(true);
        this.physics.add.overlap(this.player, star, this.collectStar, null, this);
        // star.setVelocityX(platform.body.velocity.x);
        this.starGroup.add(star);
    }
  }
  addScore(addition): void {
    this.scoreText.add(addition);
  }
}
