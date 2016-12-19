function createWorld() {

    /* * * * * * * * * * * *
     * Component Functions *
     * * * * * * * * * * * */
    var createClock = function() {
        return new THREE.Clock();
    };

    var createLight = function () {
        var light = new THREE.PointLight(CONFIG.LIGHT_COLOR, CONFIG.LIGHT_BRIGHTNESS);
        light.position.set(CONFIG.LIGHT_INITIAL_X, CONFIG.LIGHT_INITIAL_Y, CONFIG.LIGHT_INITIAL_Z);
        return light;
    };

    var createScene = function () {
        return new THREE.Scene();
    };

    var createCamera = function () {
        var camera = new THREE.PerspectiveCamera(CONFIG.CAMERA_FOV, CONFIG.CAMERA_ASPECT_RATIO,
            CONFIG.CAMERA_NEAR_PLANE, CONFIG.CAMERA_FAR_PLANE);
        camera.position.set(CONFIG.CAMERA_INITIAL_X, CONFIG.CAMERA_INITIAL_Y, CONFIG.CAMERA_INITIAL_Z);
        return camera;
    };

    var createRenderer = function () {
        var renderer = new THREE.WebGLRenderer({
            alpha: CONFIG.RENDERER_ALPHA,
            antialias: CONFIG.RENDERER_ANTIALIAS
        });
        renderer.setSize(CONFIG.RENDERER_WIDTH, CONFIG.RENDERER_HEIGHT);
        var canvasContainer = document.querySelector(CONFIG.RENDERER_CANVAS_ID);
        canvasContainer.innerHTML = '';
        canvasContainer.appendChild(renderer.domElement);
        return renderer;
    };

    var createChunk = function(scene) {
        var chunk = new Chunk(scene, CONFIG.CHUNK_WIDTH, CONFIG.CHUNK_HEIGHT, CONFIG.CHUNK_LENGTH);
        chunk.generateBlocks();
        return chunk;
    };

    var createControls = function(camera, renderer, clock) {
        return new CameraControls(camera, renderer, clock);
    };

    var createSkybox = function() {
        var skyGeometry     = new THREE.SphereBufferGeometry(CONFIG.SKYBOX_SIZE, CONFIG.SKYBOX_WIDTH,
                                                             CONFIG.SKYBOX_HEIGHT),
            textureFilename = CONFIG.BLOCK_TEXTURE_DIR + BLOCK_TYPES[BLOCK_TYPES.SKYBOX].SPHERE,
            texture         = new THREE.TextureLoader().load(textureFilename),
            skyMaterial     = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}),
            skyBox          = new THREE.Mesh(skyGeometry, skyMaterial);

        skyBox.material.fog = false;
        skyBox.position.set(CONFIG.SKYBOX_ORIGIN.X, CONFIG.SKYBOX_ORIGIN.Y, CONFIG.SKYBOX_ORIGIN.Z);
        skyBox.rotation.x = Math.PI/4;
        return skyBox;
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
    var clock       = createClock(),
        light       = createLight(),
        camera      = createCamera(),
        scene       = createScene(),
        renderer    = createRenderer(),
        // TODO: Create scene wrapper class that internally tracks all chunks
        chunk       = createChunk(scene),
        controls    = createControls(camera, renderer, clock);


    /* * * * * * * *
     * Scene Setup *
     * * * * * * * */
    var resetElements = function () {
        clock       = createClock();
        light       = createLight();
        camera      = createCamera();
        scene       = createScene(light, camera);
        renderer    = createRenderer();
        controls    = createControls(camera, renderer, clock);
    };

    var setBackground = function () {
        document.body.style.backgroundColor = CONFIG.SKYBOX_COLOR;
    };

    var resetScene = function () {
        setBackground();
        renderer.clear();
        resetElements();
        renderSample();
    };

    var disableKeyScrolling = function(keyEvent) {
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

    /*
     * Allows settings to be changed through keyboard input.
     * This method is dependent on engine components being in its closure.
     * TODO: IMPLEMENT THIS
     */
    var changeSettings = function(keyEvent) {
        switch (keyEvent.keyCode) {
            default:
                break;
        }
    };

    var toggleOverlay = function(event) {
        controls.toggleCameraPointerLock();
    };

    var setupControls = function () {
        window.addEventListener('keydown', disableKeyScrolling, false);
        window.addEventListener('keydown', changeSettings, false);
        document.querySelector(CONFIG.OVERLAY_ID).addEventListener('click', toggleOverlay);
    };

    var renderSample = function () {
        noise.seed(Math.random());
        var skyBox = createSkybox();
        addComponentsToScene(scene, light, camera, skyBox);

        setBackground();
        chunk.addBlocksToScene(scene);
        renderer.render(scene, camera);
        draw();
    };

    setupControls();
    renderSample();
    console.log('Renderer:');
    console.log(renderer.info);
}

createWorld();