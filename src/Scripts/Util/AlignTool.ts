import "phaser";

export default class AlignTool {
  /**
   * Give pulsating animation to an object
   * @param scene the current game scene
   * @param object target object to align
   * @param percentage percentage of screen width
   */
  static scaleToScreenWidth(scene: Phaser.Scene, obj: any, percentage: number) {
    obj.displayWidth = scene.cameras.main.width * percentage;
    obj.scaleY = obj.scaleX;
  }

  /**
   * Give pulsating animation to an object
   * @param scene the current game scene
   * @param object target object to align
   * @param percentage percentage of screen height
   */
  static scaleToScreenHeight(
    scene: Phaser.Scene,
    obj: any,
    percentage: number
  ) {
    obj.displayHeight = scene.cameras.main.height * percentage;
    obj.scaleX = obj.scaleY;
  }

  /**
   * Fit the object width and height to screen width and height
   * @param scene the current game scene
   * @param object target object to align
   */
  static fitToScreen(scene: Phaser.Scene, obj: any) {
    obj.displayWidth = scene.cameras.main.width;
    obj.displayHeight = scene.cameras.main.height;
  }

  /**
   * Align object x position to screen percentage from width
   * @param scene the current game scene
   * @param object target object to align
   * @param percentage percentage of screen width
   */
  static alignX(scene: Phaser.Scene, obj: any, percentage: number) {
    obj.x = scene.cameras.main.width * percentage;
  }

  /**
   * Align object y position to screen percentage from height
   * @param scene the current game scene
   * @param object target object to align
   * @param percentage percentage of screen height
   */
  static alignY(scene: Phaser.Scene, obj: any, percentage: number) {
    obj.y = scene.cameras.main.height * percentage;
  }

  /**
   * Center the object horizontally
   * @param scene the current game scene
   * @param object target object to align
   */
  static centerHorizontal(scene: Phaser.Scene, obj: any) {
    obj.x = scene.cameras.main.width / 2;
  }

  /**
   * Center the object vertically
   * @param scene the current game scene
   * @param object target object to align
   */
  static centerVertical(scene: Phaser.Scene, obj: any) {
    obj.y = scene.cameras.main.height / 2;
  }

  /**
   * Center the object to screen center
   * @param scene the current game scene
   * @param object target object to align
   */
  static centerBoth(scene: Phaser.Scene, obj: any) {
    obj.x = scene.cameras.main.width / 2;
    obj.y = scene.cameras.main.height / 2;
  }

  /**
   * Get the screen center horizontal
   * @param scene the current game scene
   */
  static getCenterHorizontal(scene: Phaser.Scene) {
    return scene.cameras.main.width / 2;
  }

  /**
   * Get the screen center vertical
   * @param scene the current game scene
   */
  static getCenterVertical(scene: Phaser.Scene) {
    return scene.cameras.main.height / 2;
  }

  /**
   * Get the x position from percentage of screen width
   * @param scene the current game scene
   * @param percentage percentage of screen width
   */
  static getXfromScreenWidth(scene: Phaser.Scene, percentage: number) {
    return scene.cameras.main.width / 2;
  }

  /**
   * Get the y position from percentage of screen height
   * @param scene the current game scene
   * @param percentage percentage of screen height
   */
  static getYfromScreenHeight(scene: Phaser.Scene, percentage: number) {
    return scene.cameras.main.height / 2;
  }
}
