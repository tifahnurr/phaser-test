import * as Phaser from "phaser";
import EntityPool from "./EntityPool";
import Star from "./Star";

class StarPool extends EntityPool {
    constructor(game, scene, player) {
        super(game, scene, player);
    }
    createNew(): Star {
        console.log('create star');
        return new Star(this.scene);
    }
    collision(player, entity): void {
        super.collision(player, entity);
        this.scene.addScore(50);
    }
}

export default StarPool;