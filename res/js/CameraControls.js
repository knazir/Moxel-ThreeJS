function CameraControls(camera, renderer, clock) {
    this.camera     = camera;
    this.renderer   = renderer;
    this.clock      = clock;
    this.controls   = new FirstPersonControls(camera, renderer.domElement);
}

CameraControls.prototype.constructor = CameraControls;

CameraControls.prototype.update = function() {
    this.controls.update(this.clock.getDelta());
};

CameraControls.prototype.toggleCameraPointerLock = function() {
    this.controls.updatePointerLock();
};

CameraControls.prototype.getPlayer = function() {
    return this.controls.getPlayer();
};
