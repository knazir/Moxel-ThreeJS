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
    CONFIG.CAMERA_POINTER_LOCK = !CONFIG.CAMERA_POINTER_LOCK;
    this.controls.updatePointerLock();
};
