/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 *
 * modified by knazir / https://www.github.com/knazir/
 */
FirstPersonControls = function (camera, domElement) {
	this.camera             = camera;
	this.target             = new THREE.Vector3(0, 0, 0);
	this.domElement         = (domElement !== undefined) ? domElement : document;
	this.enabled            = true;

    // this.geometry           = new THREE.BoxBufferGeometry(CONFIG.PLAYER_WIDTH, CONFIG.PLAYER_HEIGHT,
    //                                                       CONFIG.PLAYER_WIDTH);
    // this.player             = new THREE.Mesh(this.geometry);
    // this.gravity            = CONFIG.PLAYER_GRAVITY;
    // this.mass               = CONFIG.PLAYER_MASS;
    // this.colliding          = false;

	this.movementSpeed      = CONFIG.CAMERA_MOVE_SPEED;
	this.lookSpeed          = CONFIG.CAMERA_LOOK_SPEED;
	this.lookVertical       = true;
	this.autoForward        = false;
	this.activeLook         = true;

	this.heightSpeed        = false;
	this.heightCoef         = 1.0;
	this.heightMin          = 0.0;
	this.heightMax          = 1.0;

	this.constrainVertical  = CONFIG.CAMERA_CONSTRAIN_LOOK;
	this.verticalMin        = 0;
	this.verticalMax        = Math.PI;

	this.autoSpeedFactor    = 0.0;

	this.mouseX             = 0;
	this.mouseY             = 0;

	this.lat                = 0;
	this.lon                = 0;
	this.phi                = 0;
	this.theta              = 0;

	this.moveForward        = false;
	this.moveBackward       = false;
	this.moveLeft           = false;
	this.moveRight          = false;
    this.sprinting          = false;

	if (this.domElement !== document) {
		this.domElement.setAttribute('tabindex', - 1);
	}

	this.onMouseDown = function (event) {
		if (this.domElement !== document) {
			this.domElement.focus();
		}

		event.preventDefault();
		event.stopPropagation();

		if (this.activeLook) {
			switch (event.button) {
				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;
			}
		}
	};

	this.onMouseUp = function (event) {
		event.preventDefault();
		event.stopPropagation();

		if (this.activeLook) {
			switch (event.button) {
				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;
			}
		}
	};

	this.onMouseMove = function (event) {
        this.mouseX = event.movementX   ||
                event.mozMovementX      ||
                event.webkitMovementX   ||
                0;
        this.mouseY = event.movementY   ||
                event.mozMovementY      ||
                event.webkitMovementY   ||
                0;
	};

	this.onKeyDown = function (event) {
		//event.preventDefault();
		switch (event.keyCode) {
			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

            case 32: /*space*/
			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

            case 16: /*shift*/ this.sprinting = true; this.movementSpeed *= CONFIG.CAMERA_SPRINT_MODIFIER; break;
		}
	};

	this.onKeyUp = function (event) {
		switch (event.keyCode) {
			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

            case 32: /*space*/
			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

            case 16: /*shift*/ this.sprinting = false; this.movementSpeed /= CONFIG.CAMERA_SPRINT_MODIFIER; break;
		}
	};

	function contextmenu(event) {
		event.preventDefault();
	}

	// setup pointer lock listeners
    this.onPointerLockChange = function() {
        this.hasPointerLock =   document.pointerLockElement === this.domElement     ||
                                document.mozPointerLockElement === this.domElement  ||
                                document.webkitPointerLockElement === this.domElement;

        // TODO: Make overlay update independent of controls
        var overlay = document.querySelector(CONFIG.OVERLAY_ID);
        if (this.hasPointerLock) {
            overlay.style.display = 'none';

            this.domElement.addEventListener('mousemove', _onMouseMove, false);
            this.domElement.addEventListener('mousedown', _onMouseDown, false);
            this.domElement.addEventListener('mouseup', _onMouseUp, false);
            window.addEventListener('keydown', _onKeyDown, false);
            window.addEventListener('keyup', _onKeyUp, false);
        } else {
            overlay.style.display = 'flex';

            this.domElement.removeEventListener('mousemove', _onMouseMove, false);
            this.domElement.removeEventListener('mousedown', _onMouseDown, false);
            this.domElement.removeEventListener('mouseup', _onMouseUp, false);
            window.removeEventListener('keydown', _onKeyDown, false);
            window.removeEventListener('keyup', _onKeyUp, false);
        }
    };

    this.onPointerLockError = function() {
        console.log('Error locking pointer. The pointer is most likely not hidden.');
    };

	var _onMouseMove            = bind(this, this.onMouseMove),
	    _onMouseDown            = bind(this, this.onMouseDown),
        _onMouseUp              = bind(this, this.onMouseUp),
        _onKeyDown              = bind(this, this.onKeyDown),
	    _onKeyUp                = bind(this, this.onKeyUp),
        _onPointerLockChange    = bind(this, this.onPointerLockChange),
        _onPointerLockError     = bind(this, this.onPointerLockError);

    // Just handle pointer lock listeners here, we can add others on pointer lock change
    document.addEventListener('pointerlockchange', _onPointerLockChange, false);
    document.addEventListener('mozpointerlockchange', _onPointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', _onPointerLockChange, false);
    document.addEventListener('pointerlockerror', _onPointerLockError, false);
    document.addEventListener('mozpointerlockerror', _onPointerLockError, false);
    document.addEventListener('webkitpointerlockerror', _onPointerLockError, false);

	function bind(scope, fn) {
		return function () {
			fn.apply(scope, arguments);
		};
	}

	this.checkCollisions = function() {
        for (var vertexIndex = 0; vertexIndex < this.player.geometry.vertices.length; vertexIndex++) {
            var localVertex         = this.player.geometry.vertices[vertexIndex].clone(),
                globalVertex        = this.player.matrix.multiplyVector3(localVertex),
                directionVector     = globalVertex.subSelf(this.player.position),
                ray                 = new THREE.Ray(this.player.position, directionVector.clone().normalize()),
                collisionResults    = ray.intersectObjects(collidableMeshList);

            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                console.log('Collided.');
            }
        }
    };

	// setup player object with camera
    // this.player.add(this.camera);
};

FirstPersonControls.prototype.constructor = FirstPersonControls;

/*
 * Updates the camera's position relative to changes in the mouse location. Should be called
 * every frame with the frame delta passed as an argument.
 */
FirstPersonControls.prototype.update = function(delta) {
    if (!this.enabled) {
        return;
    }

    if (this.heightSpeed) {
        var y = THREE.Math.clamp(this.camera.position.y, this.heightMin, this.heightMax);
        var heightDelta = y - this.heightMin;

        this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
    } else {
        this.autoSpeedFactor = 0.0;
    }

    var actualMoveSpeed = delta * this.movementSpeed;

    if (this.moveForward || (this.autoForward && !this.moveBackward)) this.camera.translateZ(-(actualMoveSpeed + this.autoSpeedFactor));
    if (this.moveBackward) this.camera.translateZ(actualMoveSpeed);

    if (this.moveLeft) this.camera.translateX(-actualMoveSpeed);
    if (this.moveRight) this.camera.translateX(actualMoveSpeed);

    if (this.moveUp) this.camera.translateY(actualMoveSpeed);
    if (this.moveDown) this.camera.translateY(-actualMoveSpeed);

    var actualLookSpeed = delta * this.lookSpeed;

    if (!this.activeLook) {
        actualLookSpeed = 0;
    }

    var verticalLookRatio = 1;

    if (this.constrainVertical) {
        verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
    }

    this.lon += this.mouseX * actualLookSpeed;
    if (this.lookVertical) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

    this.lat    = Math.max(-85, Math.min(85, this.lat));
    this.phi    = THREE.Math.degToRad(90 - this.lat);
    this.theta  = THREE.Math.degToRad(this.lon);

    if (this.constrainVertical) {
        this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
    }

    var targetPosition  = this.target,
        position        = this.camera.position;

    targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
    targetPosition.y = position.y + 100 * Math.cos(this.phi);
    targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.lookAt(targetPosition);

    //this.checkCollisions();

    if (this.hasPointerLock) {
        this.mouseX = 0;
        this.mouseY = 0;
    }
};

/*
 * Checks if the current browser is capable of pointer lock and makes a request to the browser
 * to acquire the lock. Updates internal pointer lock state.
 */
FirstPersonControls.prototype.updatePointerLock = function() {
    this.hasPointerLock = 'pointerLockElement' in document    ||
                          'mozPointerLockElement' in document ||
                          'webkitPointerLockElement' in document;

    if (this.hasPointerLock) {
        this.domElement.requestPointerLock = this.domElement.requestPointerLock      ||
                                             this.domElement.mozRequestPointerLock   ||
                                             this.domElement.webkitRequestPointerLock;
        this.domElement.requestPointerLock();
    }
};

/*
 * Removes all event listeners associated with the controls.
 */
FirstPersonControls.prototype.dispose = function() {
    this.domElement.removeEventListener('contextmenu', contextmenu, false);
    this.domElement.removeEventListener('mousedown', _onMouseDown, false);
    this.domElement.removeEventListener('mousemove', _onMouseMove, false);
    this.domElement.removeEventListener('mouseup', _onMouseUp, false);

    if (this.hasPointerLock) {
        // Ask the browser to release the pointer
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock ||
            document.webkitExitPointerLock;
        document.exitPointerLock();

        document.removeEventListener('pointerlockchange', _onPointerLockChange, false);
        document.removeEventListener('mozpointerlockchange', _onPointerLockChange, false);
        document.removeEventListener('webkitpointerlockchange', _onPointerLockChange, false);
    }

    window.removeEventListener('keydown', _onKeyDown, false);
    window.removeEventListener('keyup', _onKeyUp, false);
};

/*
 * Return the 3D player object these controls and camera are attached to.
 */
FirstPersonControls.prototype.getPlayer = function() {
    return this.player;
};
