import * as Phaser from "phaser";
import Shopee from "../Object/Shopee";
import FpsText from "../Object/FpsText";
import Player from "../Object/Player";
import Star from "../Object/Star";
import Saw from "../Object/Saw";
import ScoreText from "../Object/ScoreText";
import Obstacle from "../Object/Obstacle";
import StarPool from "../Object/StarPool";
import ObstaclePool from "../Object/ObstaclePool";

import { getResolution, getConfig } from "../Util/Util";

export default class GameScene extends Phaser.Scene {
  private fpsText: FpsText;
  private player: Player;
  private isSpawningObject: Boolean;
  private ground: Phaser.GameObjects.TileSprite;
  private dirt: Phaser.GameObjects.TileSprite;
  private sky: Phaser.GameObjects.TileSprite;
  private background: Phaser.GameObjects.TileSprite[] = [];
  private starPool: StarPool;
  private obstaclePool: ObstaclePool;
  private sawPool: ObstaclePool;
  private platform: Phaser.Physics.Arcade.StaticGroup;
  private scoreText: ScoreText;
  private gameOverText: Phaser.GameObjects.Text;
  private basePlatformPositionY: integer;
  private gameOver: Boolean = false;
  private speed: integer;

  private audio = { jump: null, score: null, collision: null, bg: null };
  constructor() {
    super({ key: "GameScene" });
  }

  preload(): void {
    while (this.background.length) {
      this.background.pop();
    }
  }

  create(): void {
    // create backdrop
    this.basePlatformPositionY = (getResolution().height * 2) / 3;
    this.sky = this.add.tileSprite(
      getResolution().width / 2,
      getResolution().height / 2,
      getResolution().width,
      getResolution().height,
      "sky"
    );
    //parallax mountain
    this.background.push(
      this.add.tileSprite(
        getResolution().width / 2,
        this.basePlatformPositionY - 200,
        0,
        0,
        "mountain"
      )
    );
    this.background.push(
      this.add
        .tileSprite(
          getResolution().width / 2,
          this.basePlatformPositionY - 125,
          0,
          0,
          "mountain"
        )
        .setTint(0xdddddd)
        .setScale(0.8)
        .setTilePosition(500)
    );
    this.background.push(
      this.add
        .tileSprite(
          getResolution().width / 2,
          this.basePlatformPositionY - 75,
          0,
          0,
          "mountain"
        )
        .setTint(0xaaaaaa)
        .setScale(0.7)
        .setTilePosition(1000)
    );
    //platform
    this.platform = this.physics.add.staticGroup();
    this.platform.create(
      this.cameras.main.width / 3,
      this.basePlatformPositionY + 5,
      "grass"
    );
    //platform tilesprite
    this.ground = this.add
      .tileSprite(
        0,
        this.basePlatformPositionY - 30,
        getResolution().width,
        50,
        "grass"
      )
      .setOrigin(0, 0);
    this.dirt = this.add
      .tileSprite(
        0,
        this.basePlatformPositionY + 20,
        getResolution().width,
        getResolution().height - this.basePlatformPositionY,
        "dirt"
      )
      .setOrigin(0, 0);

    //load sound
    this.audio.jump = this.sound.add("jump");
    this.audio.score = this.sound.add("score");
    this.audio.bg = this.sound.add("bg");
    this.audio.collision = this.sound.add("collision");
    this.audio.bg.loop = true;
    if (!this.audio.bg.isPlaying) {
      this.audio.bg.play();
    }

    //game setup
    this.speed = 4.5;
    this.gameOver = false;
    this.physics.resume();
    this.time.timeScale = 1;
    this.isSpawningObject = false;

    //entities
    this.player = new Player(
      this,
      this.cameras.main.width / 3,
      this.basePlatformPositionY - 200
    );
    this.physics.add.collider(this.player, this.platform);
    this.starPool = new StarPool(
      this.game,
      this,
      this.player,
      this.basePlatformPositionY,
      this.audio.score
    );
    this.obstaclePool = new ObstaclePool(
      this.game,
      this,
      this.player,
      this.basePlatformPositionY,
      this.audio.collision
    );
    this.sawPool = new ObstaclePool(
      this.game,
      this,
      this.player,
      this.basePlatformPositionY,
      this.audio.collision
    );

    //text
    this.fpsText = new FpsText(this);
    this.scoreText = new ScoreText(this);
    this.gameOverText = this.add.text(
      getResolution().width / 2,
      getResolution().height / 2,
      "GAME OVER",
      { fontSize: "32px", color: "#000" }
    );
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.visible = false;

    //events
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: () => {
        this.scoreText.add(100);
        this.speed += 0.05;
        console.log(this.speed);
      },
    });
    this.events.off("addScore");
    this.events.off("gameOver");
    this.events.on("addScore", this.addScore, this);
    this.events.on("gameOver", this.runGameOver, this);
  }

  update(time, delta): void {
    this.fpsText.update();
    this.scoreText.update();
    if (!this.gameOver) {
      //update positions
      this.ground.tilePositionX += this.speed;
      this.dirt.tilePositionX += this.speed;
      this.starPool.update(this.speed);
      this.obstaclePool.update(this.speed);
      this.sawPool.update(this.speed);
      this.background.forEach((background, index) => {
        background.tilePositionX += index * 0.4 + 0.075;
      });
      this.sky.tilePositionX += 0.03;

      //check input
      let cursors = this.input.keyboard.createCursorKeys();
      let mouse = this.input.activePointer;
      if (
        (cursors.up.isDown || cursors.space.isDown || mouse.isDown) &&
        !this.player.isJumping
      ) {
        this.player.jump();
        // this.audio.jump.play();
        setTimeout(() => {
          this.player.setIsJumping(false);
        }, 1500);
      }

      //play animation if not playing
      if (!this.player.anims.isPlaying) {
        this.player.anims.play("run");
      }

      //spawn random object
      if (!this.isSpawningObject) {
        this.isSpawningObject = true;
        this.time.addEvent({
          delay: Phaser.Math.Between(3000, 5000),
          loop: false,
          callback: () => {
            if (!this.gameOver) {
              let randomObj = Phaser.Math.Between(0, 5);
              switch (randomObj) {
                case 0:
                  this.starPool.spawn(Star);
                  break;
                case 1:
                case 3:
                case 5:
                  this.obstaclePool.spawn(Obstacle);
                  break;
                case 2:
                case 4:
                  this.sawPool.spawn(Saw);
                  break;
              }
              this.isSpawningObject = false;
            }
          },
        });
      }
    }
  }

  runGameOver(): void {
    //update game settings
    this.gameOver = true;
    this.time.timeScale = 0;

    //stop all movements
    this.player.stop();
    this.starPool.stopAll();
    this.obstaclePool.stopAll();
    this.sawPool.stopAll();

    //show gameover text
    this.gameOverText.visible = true;

    //check input
    this.input.keyboard.on("keydown", () => {
      this.audio.bg.stop();
      this.scene.restart();
    });
    this.input.on("pointerdown", () => {
      this.audio.bg.stop();
      this.scene.restart();
    });
  }

  addScore(addition): void {
    this.scoreText.add(addition);
  }
}
