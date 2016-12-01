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
        var chunk = new Chunk(scene, CONFIG.CHUNK_WIDTH, CONFIG.CHUNK_HEIGHT, CONFIG.CHUNK_LENGTH);
        chunk.generateBlocks();
        return chunk;
    };

    var createCameraControls = function () {
        return new CameraControls(camera, new THREEx.KeyboardState(), new THREE.Clock());
    };

    var createSkybox = function() {
        var textureFactory  = new TextureFactory(),
            geometry        = new THREE.BoxGeometry(CONFIG.SKYBOX_SIZE, CONFIG.SKYBOX_SIZE, CONFIG.SKYBOX_SIZE),
            material        = textureFactory.createTextureMaterials(BLOCK_TYPES.SKYBOX),
            skybox          = new THREE.Mesh(geometry, material);
        skybox.position.set(CONFIG.CAMERA_INITIAL_X, CONFIG.CAMERA_INITIAL_Y, CONFIG.CAMERA_INITIAL_Z);
        return skybox;
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
        document.body.style.backgroundColor = CONFIG.SKYBOX_COLOR;
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
        noise.seed(Math.random());
        skybox = createSkybox();
        addComponentsToScene(scene, light, camera, skybox);

        // var skyGeometry = new THREE.SphereGeometry(5000,50,50);
        // var texture;
        // texture = THREE.ImageUtils.loadTexture('res/textures/blocks/grass_top.png');

        // var skyMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide });
        // _skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        // _skyBox.material.fog = false;
        // _skyBox.position.set(0,0,0);
        // _skyBox.rotation.x = Math.PI/4;
        // scene.add( _skyBox );

        setBackground();
        chunk.addBlocksToScene(scene);
        renderer.render(scene, camera);
        draw();
    };

    setupControls();
    renderSample();
}

createWorld();