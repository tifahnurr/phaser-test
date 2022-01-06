import * as Phaser from "phaser"

import {getResolution, getConfig} from '../Util/Util'

export default class Saw extends Phaser.Physics.Arcade.Sprite
{
    public isCollected=false;
    constructor(scene:Phaser.Scene)
    {
        super(scene, getResolution().width + 50, getResolution().height * 3 / 4 - 50, "saw");

        this.scene.add.existing(this);

        scene.physics.add.existing(this);

        this.setInteractive();
        this.setVelocityX(getConfig().moveSpeed);
        this.setAngularVelocity(300);
        this.setImmovable();
    }
    update(): void {
        if (this.getRightCenter().x < 0) {
            this.destroy();
        }
    }
    collected(): void {
        console.log("collected");
        this.destroy();
    }
}