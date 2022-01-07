import * as Phaser from "phaser"

import {getResolution, getConfig} from '../Util/Util'
import Entity from './Entity';

export default class Star extends Entity
{
    constructor(scene:Phaser.Scene)
    {
        console.log("create star entity");
        super(scene, getResolution().width + 50, getResolution().height * 3 / 4 - 200, "crystal");
    }
    kill(): void {
        super.kill();
    }
}