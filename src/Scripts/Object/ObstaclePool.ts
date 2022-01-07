import * as Phaser from "phaser";
import EntityPool from "./EntityPool";

class ObstaclePool extends EntityPool {
    constructor(game, scene, player, collisionSound) {
        console.log("obstacle pool");
        super(game, scene, player, collisionSound);
        this.onCollisionEvent = this.onCollision;
    }

    onCollision(player, entity): void {
        if (!entity.isCollided) {
            entity.collision();
            console.log("collided obstacle");
            this.collisionSound.play();
            this.scene.collided();
        }
    }
}

export default ObstaclePool;