import * as Phaser from "phaser";
import Entity from "./Entity";
import Player from "./Player";

class EntityPool {
    private pool: Phaser.Physics.Arcade.Group;
    private group: Phaser.Physics.Arcade.Group;
    protected scene: Phaser.Scene;
    private player: Player;
    private Entity: Class;
    
    constructor(game, scene, player) {
        this.scene = scene;
        this.player = player;
        this.pool = this.scene.physics.add.group({
            removeCallback: function(star){
                this.group.add(star)
            }});
        this.group = this.scene.physics.add.group({
            removeCallback: function(star){
                this.pool.add(star)
            }});
    }
    spawn(Type): void {
        if (this.pool.getLength()) {
            console.log("recycle star");
            let star = this.pool.getFirst();
            star.alpha = 1;
            star.active = true;
            star.visible = true;
            star.reset();
            this.pool.remove(star);
          } else {
            console.log("create new star");
            let entity = new Type(this.scene);
            this.scene.physics.add.overlap(this.player, entity, this.collision, null, this.scene);
            this.group.add(entity);
          }
    }
    collision(player, entity): void {
        entity.kill();
        this.group.remove(entity);
        this.group.killAndHide(entity);
    }

    createNew(): Entity {
        return null;
    }
}

export default EntityPool;