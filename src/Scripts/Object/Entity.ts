import * as Phaser from "phaser"

import {getResolution, getConfig} from '../Util/Util'

export default class Entity extends Phaser.Physics.Arcade.Sprite
{
    public isCollided = false;
    private posX;
    private posY;
    constructor(scene:Phaser.Scene, x, y, assetName)
    {
        super(scene, x, y, assetName);
        this.posX = x;
        this.posY = y;
        this.scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setInteractive();
        this.setVelocityX(getConfig().moveSpeed);
        this.setImmovable();
    }
    update(): void {
        if (this.getRightCenter().x < 0) {
            this.kill();
        }
    }
    kill(): void {
        console.log("collided");
        this.isCollided = true;
        this.setVelocityX(0);
        this.setAngularVelocity(0);
    }
    reset(): void {
        this.isCollided = false;
        this.setX(this.posX);
        this.setY(this.posY);
        this.setVelocityX(getConfig().moveSpeed);
    }
}