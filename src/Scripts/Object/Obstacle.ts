import * as Phaser from "phaser"

import {getResolution, getConfig} from '../Util/Util'
import Entity from './Entity';

export default class Obstacle extends Entity
{
    constructor(scene:Phaser.Scene)
    {
        super(scene, getResolution().width + 50, getResolution().height * 3 / 4 - 65, "obstacle");
    }
}