function CameraControls(camera, keyboard, clock) {
    this.camera = camera;
    this.keyboard = keyboard;
    this.clock = clock;
}

CameraControls.prototype.constructor = CameraControls;

CameraControls.prototype.update = function() {
    var delta           = this.clock.getDelta(),
        moveDistance    = CONTROL_MOVE_SPEED,
        rotateAngle     = Math.PI / 2 * delta;

    // Forwards and backwards movement
    if (this.keyboard.pressed('w') || this.keyboard.pressed('up')) {
        this.camera.translateZ(-moveDistance);
    }
    if (this.keyboard.pressed('s') || this.keyboard.pressed('down')) {
        this.camera.translateZ(moveDistance);
    }

    // Rotating left or right
    if (this.keyboard.pressed('a') || this.keyboard.pressed('left')) {
        this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    }
    if (this.keyboard.pressed('d') || this.keyboard.pressed('right')) {
        this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
    }
};