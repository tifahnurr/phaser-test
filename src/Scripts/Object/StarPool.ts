import * as Phaser from "phaser";
import EntityPool from "./EntityPool";
import Star from "./Star";

class StarPool extends EntityPool {
  constructor(game, scene, player, basePositionY, collisionSound) {
    console.log("star pool");
    super(game, scene, player, basePositionY, collisionSound);
    this.onCollisionEvent = this.onCollision;
  }

  onCollision(player, entity): void {
    if (!entity.isCollided) {
      console.log("star collision");
      this.group.killAndHide(entity);
      this.group.remove(entity);
      entity.collision();
      this.collisionSound.play();
      this.scene.events.emit("addScore", 50);
    }
  }
}

export default StarPool;
