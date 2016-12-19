function CameraControls(camera, keyboard, clock) {
    this.camera = camera;
    this.keyboard = keyboard;
    this.clock = clock;
}

CameraControls.prototype.constructor = CameraControls;

CameraControls.prototype.update = function() {
    var delta           = this.clock.getDelta(),
        moveDistance    = CONFIG.CAMERA_MOVE_SPEED,
        rotateAngle     = Math.PI / 2 * delta;

    // Forwards and backwards movement
    if (this.keyboard.pressed('w') || this.keyboard.pressed('up')) {
        this.camera.translateZ(-moveDistance);
    }
    if (this.keyboard.pressed('s') || this.keyboard.pressed('down')) {
        this.camera.translateZ(moveDistance);
    }

    // Leftward and rightward strafing
    if (this.keyboard.pressed('q')) {
        this.camera.translateX(-moveDistance);
    }
    if (this.keyboard.pressed('e')) {
        this.camera.translateX(moveDistance);
    }

    // Moving up and down
    if (this.keyboard.pressed('r')) {
        this.camera.translateY(moveDistance)
    }
    if (this.keyboard.pressed('f')) {
        this.camera.translateY(-moveDistance);
    }

    // Rotating up or down
    if (this.keyboard.pressed('t')) {
        this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle);
    }
    if (this.keyboard.pressed('g')) {
        this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle);
    }

    // Rotating left or right
    if (this.keyboard.pressed('a') || this.keyboard.pressed('left')) {
        this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    }
    if (this.keyboard.pressed('d') || this.keyboard.pressed('right')) {
        this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
    }
};

