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
    
    constructor(game, scene, player, collisionSound) {
        console.log('construct');
        const self = this;
        this.scene = scene;
        this.player = player;
        this.pool = this.scene.physics.add.group({
            removeCallback: function(entity){
                self.group.add(entity)
            }});
        this.group = this.scene.physics.add.group({
            removeCallback: function(entity){
                self.pool.add(entity)
            }});
        this.collisionSound = collisionSound;
    }
    spawn(Type): void {
        let entity;
        if (this.pool.getLength()) {
            entity = this.pool.getFirst();
            this.pool.remove(entity);
            entity.alpha = 1;
            entity.active = true;
            entity.visible = true;
            entity.reset();
        } else {
            entity = new Type(this.scene);
            this.scene.physics.add.overlap(this.player, entity, this.onCollision, null, this);
            this.group.add(entity);
            entity.alpha = 1;
            entity.active = true;
            entity.visible = true;
            entity.reset();
        }
    }

    onCollision(player, entity): void {
    }
}

export default EntityPool;