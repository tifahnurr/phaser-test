import * as Phaser from "phaser";

import { getResolution, getConfig } from "../Util/Util";

export default class ScoreText extends Phaser.GameObjects.Text {
  private score;
  constructor(scene: Phaser.Scene) {
    super(scene, getResolution().width / 2, 10, "", {
      color: "white",
      fontSize: "48px",
    });
    scene.add.existing(this);
    this.setOrigin(0.5, 0);
    this.score = 0;
  }

  update() {
    this.setText(`Score: ${Math.floor(this.score)}`);
  }

  add(addition) {
    this.score += addition;
  }

  reset() {
    this.score = 0;
  }
}
