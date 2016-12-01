function createWorld() {

    /* * * * * * * * * * * *
     * Component Functions *
     * * * * * * * * * * * */
    var createScene = function () {
        return new THREE.Scene();
    };

    var createLight = function () {
        var light = new THREE.PointLight(CONFIG.LIGHT_COLOR, CONFIG.LIGHT_BRIGHTNESS);
        light.position.set(CONFIG.LIGHT_INITIAL_X, CONFIG.LIGHT_INITIAL_Y, CONFIG.LIGHT_INITIAL_Z);
        return light;
    };

    var createCamera = function () {
        var camera = new THREE.PerspectiveCamera(CONFIG.CAMERA_FOV, CONFIG.CAMERA_ASPECT_RATIO, CONFIG.CAMERA_NEAR_PLANE,
            CONFIG.CAMERA_FAR_PLANE);
        camera.position.set(CONFIG.CAMERA_INITIAL_X, CONFIG.CAMERA_INITIAL_Y, CONFIG.CAMERA_INITIAL_Z);
        return camera;
    };

    var createRenderer = function () {
        var renderer = new THREE.WebGLRenderer({alpha: CONFIG.RENDERER_ALPHA});
        renderer.setSize(CONFIG.RENDERER_WIDTH, CONFIG.RENDERER_HEIGHT);
        var canvasContainer = document.querySelector(CONFIG.RENDERER_CANVAS_ID);
        canvasContainer.innerHTML = '';
        canvasContainer.appendChild(renderer.domElement);
        return renderer;
    };

    var createChunk = function() {
        var chunk = new Chunk(CONFIG.CHUNK_WIDTH, CONFIG.CHUNK_HEIGHT, CONFIG.CHUNK_LENGTH);
        chunk.generateBlocks();
        return chunk;
    };

    var createCameraControls = function () {
        return new CameraControls(camera, new THREEx.KeyboardState(), new THREE.Clock());
    };


    /* * * * * * * * * *
     * Rendering Logic *
     * * * * * * * * * */
    var addComponentsToScene = function (scene) {
        for (var i = 1; i < arguments.length; i++) {
            scene.add(arguments[i]);
        }
    };

    var draw = function () {
        window.requestAnimationFrame(function () {
            controls.update();
            if (CONFIG.LIGHT_FOLLOW_CAMERA) {
                light.position.set(camera.position.x, camera.position.y, camera.position.z);
                light.rotation.set(camera.rotation.x, camera.rotation.y, camera.rotation.z);
            }
            renderer.render(scene, camera);
            draw();
        });
    };


    /* * * * * * * * * * *
     * Engine Components *
     * * * * * * * * * * */
    var light       = createLight(),
        camera      = createCamera(),
        scene       = createScene(),
        renderer    = createRenderer(),
        chunk       = createChunk(),
        controls    = createCameraControls();


    /* * * * * * * *
     * Scene Setup *
     * * * * * * * */
    var resetElements = function () {
        light = createLight();
        camera = createCamera();
        scene = createScene(light, camera);
        renderer = createRenderer();
        controls = createCameraControls();
    };

    var setBackground = function () {
        document.body.style.backgroundColor = CONFIG.COLOR_SKY;
    };

    var resetScene = function () {
        setBackground();
        renderer.clear();
        resetElements();
        renderSample();
    };

    var disableKeyScrolling = function (keyEvent) {
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

    var setupControls = function () {
        window.addEventListener('keydown', disableKeyScrolling, false);
    };

    var renderSample = function () {
        addComponentsToScene(scene, light, camera);
        setBackground();
        chunk.addBlocksToScene(scene);
        renderer.render(scene, camera);
        draw();
    };

    setupControls();
    renderSample();
}

createWorld();