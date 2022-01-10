import * as Phaser from "phaser";

import { getResolution, getConfig } from "../Util/Util";
import Entity from "./Entity";

export default class Star extends Entity {
  constructor(scene: Phaser.Scene, basePositionY) {
    console.log("create star entity");
    super(scene, getResolution().width + 50, basePositionY - 200, "crystal");
  }
  collision(): void {
    super.killEntity();
    this.setX(-30);
    this.setY(-30);
  }
}
