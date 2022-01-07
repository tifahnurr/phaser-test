import * as Phaser from "phaser"

import {getResolution, getConfig} from '../Util/Util'
import Entity from './Entity';

export default class Saw extends Entity
{
    constructor(scene:Phaser.Scene)
    {
        super(scene, getResolution().width + 50, getResolution().height * 3 / 4 - 50, "saw");
        this.setAngularVelocity(300);
    }
}