import * as Phaser from "phaser";

import { getResolution, getConfig } from "../Util/Util";
import Entity from "./Entity";

export default class Obstacle extends Entity {
  constructor(scene: Phaser.Scene, basePositionY) {
    super(scene, getResolution().width + 50, basePositionY - 65, "obstacle");
  }
}
