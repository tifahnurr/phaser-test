import * as Phaser from "phaser";
import Entity from "./Entity";
import Player from "./Player";

class EntityPool {
  public pool: Phaser.Physics.Arcade.Group;
  public group: Phaser.Physics.Arcade.Group;
  protected scene: Phaser.Scene;
  private player: Player;
  protected collisionSound;
  protected onCollisionEvent;
  protected basePositionY;

  constructor(game, scene, player, basePositionY, collisionSound) {
    console.log("construct");
    const self = this;
    this.scene = scene;
    this.player = player;
    this.basePositionY = basePositionY;
    this.pool = this.scene.physics.add.group({
      removeCallback: function (entity) {
        self.group.add(entity);
      },
    });
    this.group = this.scene.physics.add.group({
      removeCallback: function (entity) {
        self.pool.add(entity);
      },
    });
    this.collisionSound = collisionSound;
  }

  spawn(Type): void {
    let entity;
    if (this.pool.getLength()) {
      entity = this.pool.getFirst();
      this.pool.remove(entity);
      entity.reset();
    } else {
      entity = new Type(this.scene, this.basePositionY);
      this.scene.physics.add.overlap(
        this.player,
        entity,
        this.onCollision,
        null,
        this
      );
      this.group.add(entity);
      entity.reset();
    }
  }

  onCollision(player, entity): void {}

  stopAll(): void {
    this.group.getChildren().forEach((element:Entity) => {
      element.killEntity();
    });
  }
  update(speed): void {
    this.group.getChildren().forEach((element:Entity) => {
      // console.log("move child");
      element.x -= speed;
    });
  }
}

export default EntityPool;
