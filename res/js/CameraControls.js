function CameraControls(camera, renderer, clock) {
    this.camera = camera;
    this.renderer = renderer;
    this.clock = clock;
    this.controls = new THREE.FirstPersonControls(camera, renderer.domElement)
}

CameraControls.prototype.constructor = CameraControls;

CameraControls.prototype.setup = function() {
    window.addEventListener('keydown', CameraControls.disableKeyScrolling, false);
};

CameraControls.prototype.update = function() {
    this.controls.update(this.clock.getDelta());
};

CameraControls.disableKeyScrolling = function (keyEvent) {
    switch (keyEvent.keyCode) {
        case 37:
        case 39:
        case 38:
        case 40: // Arrow keys
        case 32: // Space
            keyEvent.preventDefault();
            break;
        default:
            break;
    }
};
