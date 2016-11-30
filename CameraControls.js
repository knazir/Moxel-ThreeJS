function CameraControls() {

}

CameraControls.prototype.constructor = CameraControls;

CameraControls.prototype.update = function(camera, keyboard, clock) {
    var delta           = clock.getDelta(),
        moveDistance    = CONTROL_MOVE_SPEED,
        rotateAngle     = Math.PI / 2 * delta;

    // Forwards and backwards movement
    if (keyboard.pressed('w') || keyboard.pressed('up')) {
        camera.translateZ(-moveDistance);
    }
    if (keyboard.pressed('s') || keyboard.pressed('down')) {
        camera.translateZ(moveDistance);
    }

    // Rotating left or right
    if (keyboard.pressed('a') || keyboard.pressed('left')) {
        camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    }
    if (keyboard.pressed('d') || keyboard.pressed('right')) {
        camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
    }
};