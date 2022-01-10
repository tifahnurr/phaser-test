import * as Phaser from "phaser"


export default class Player extends Phaser.Physics.Arcade.Sprite
{
    public isJumping = false;
    private jumpSound;
    constructor(scene:Phaser.Scene, x:number, y:number)
    {
        super(scene, x, y, "runner");
        this.scene.add.existing(this);
        scene.physics.add.existing(this);
        // this.hitArea.setTo(10, 30, 100, 100);

        this.setCollideWorldBounds();
        this.setGravity(0, 400);
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('runner', {frames: [ 3, 2, 3, 2 ]}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('runner', {frames: [ 7, 1, 1, 1, 2]}),
            frameRate: 3,
            repeat: 0,
        });
        this.jumpSound = this.scene.sound.add('jump')
    }

    setIsJumping(status): void {
        this.isJumping = status;
    }
    jump(): void {
        this.setVelocityY(-300);
        this.anims.play('jump');
        this.setIsJumping(true);
        this.jumpSound.play();
    }
}