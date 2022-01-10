import * as Phaser from "phaser";
import EntityPool from "./EntityPool";

class ObstaclePool extends EntityPool {
  constructor(game, scene, player, basePositionY, collisionSound) {
    super(game, scene, player, basePositionY, collisionSound);
    this.onCollisionEvent = this.onCollision;
  }

  onCollision(player, entity): void {
    if (!entity.isCollided) {
      entity.collision();
      this.collisionSound.play();
      this.scene.events.emit("gameOver");
    }
  }
}

export default ObstaclePool;
