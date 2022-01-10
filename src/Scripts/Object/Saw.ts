import * as Phaser from "phaser"

import {getResolution, getConfig} from '../Util/Util'
import Entity from './Entity';

export default class Saw extends Entity
{
    constructor(scene:Phaser.Scene, basePositionY)
    {
        super(scene, getResolution().width + 50, basePositionY - 50, "saw");
        this.setAngularVelocity(300);
    }
    reset(): void{
        super.reset();
        this.setAngularVelocity(300);
    }
}