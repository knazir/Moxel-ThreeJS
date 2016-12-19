/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 *
 * modified by knazir / https://www.github.com/knazir
 */
THREE.FirstPersonControls = function (object, domElement) {
	this.object = object;
	this.target = new THREE.Vector3(0, 0, 0);

	this.domElement = (domElement !== undefined) ? domElement : document;

	this.enabled = true;

	this.movementSpeed = CONFIG.CAMERA_MOVE_SPEED;
	this.lookSpeed = CONFIG.CAMERA_LOOK_SPEED;

	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if (this.domElement !== document) {
		this.domElement.setAttribute('tabindex', - 1);
	}

	this.handleResize = function () {
		if (this.domElement === document) {
			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;
		} else {
			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;
		}
	};

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

		this.mouseDragOn = true;
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
		this.mouseDragOn = false;
	};

	this.onMouseMove = function (event) {
		if (this.domElement === document) {
			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;
		} else {
			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
		}
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

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;
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

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;
		}
	};

	this.update = function(delta) {
		if (!this.enabled) {
			return;
		}

		if (this.heightSpeed) {
			var y = THREE.Math.clamp(this.object.position.y, this.heightMin, this.heightMax);
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * (heightDelta * this.heightCoef);
		} else {
			this.autoSpeedFactor = 0.0;
		}

		var actualMoveSpeed = delta * this.movementSpeed;

		if (this.moveForward || (this.autoForward && ! this.moveBackward)) this.object.translateZ(- (actualMoveSpeed + this.autoSpeedFactor));
		if (this.moveBackward) this.object.translateZ(actualMoveSpeed);

		if (this.moveLeft) this.object.translateX(-actualMoveSpeed);
		if (this.moveRight) this.object.translateX(actualMoveSpeed);

		if (this.moveUp) this.object.translateY(actualMoveSpeed);
		if (this.moveDown) this.object.translateY(-actualMoveSpeed);

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

		this.lat = Math.max(-85, Math.min(85, this.lat));
		this.phi = THREE.Math.degToRad(90 - this.lat);

		this.theta = THREE.Math.degToRad(this.lon);

		if (this.constrainVertical) {
			this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);
		}

		var targetPosition 	= this.target,
			position 		= this.object.position;

		targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
		targetPosition.y = position.y + 100 * Math.cos(this.phi);
		targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

		this.object.lookAt(targetPosition);
        this.mouseX = 0;
        this.mouseY = 0;
	};

	function contextmenu(event) {
		event.preventDefault();
	}

	this.dispose = function() {
        this.domElement.removeEventListener('contextmenu', contextmenu, false);
        this.domElement.removeEventListener('mousedown', _onMouseDown, false);
        this.domElement.removeEventListener('mousemove', _onMouseMove, false);
        this.domElement.removeEventListener('mouseup', _onMouseUp, false);

        if (this.havePointerLock) {
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

	// pointer lock
    this.havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;

    if (this.havePointerLock) {
        this.domElement.requestPointerLock = this.domElement.requestPointerLock ||
            this.domElement.mozRequestPointerLock || this.domElement.webkitRequestPointerLock;

        // Ask the browser to lock the pointer
        this.domElement.requestPointerLock();

        this.onPointerLockChange = function(event) {
            if (document.pointerLockElement === this.domElement ||
                document.mozPointerLockElement === this.domElement ||
                document.webkitPointerLockElement === this.domElement) {
                // Pointer was just locked, enable the mousemove listener
                this.domElement.addEventListener("mousemove", _onMouseMove, false);
            } else {
                // Pointer was just unlocked, disable the mousemove listener
                this.domElement.removeEventListener("mousemove", _onMouseMove, false);
                this.unlockHook(this.domElement);
            }
        };

        this.onPointerLockError = function(event) {
            console.log('Error locking pointer. The pointer is most likely not hidden.');
        };

        var _onPointerLockChange    = bind(this, this.onPointerLockChange),
            _onPointerLockError     = bind(this, this.onPointerLockError);

        document.addEventListener('pointerlockchange', _onPointerLockChange, false);
        document.addEventListener('mozpointerlockchange', _onPointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', _onPointerLockChange, false);
        document.addEventListener('pointerlockerror', _onPointerLockError, false);
        document.addEventListener('mozpointerlockerror', _onPointerLockError, false);
        document.addEventListener('webkitpointerlockerror', _onPointerLockError, false);
    }

    // other event listeners
	var _onMouseMove            = bind(this, this.onMouseMove),
	    _onMouseDown            = bind(this, this.onMouseDown),
        _onMouseUp              = bind(this, this.onMouseUp),
        _onKeyDown              = bind(this, this.onKeyDown),
	    _onKeyUp                = bind(this, this.onKeyUp);

    this.domElement.addEventListener('contextmenu', contextmenu, false);
	this.domElement.addEventListener('mousemove', _onMouseMove, false);
	this.domElement.addEventListener('mousedown', _onMouseDown, false);
	this.domElement.addEventListener('mouseup', _onMouseUp, false);

	window.addEventListener('keydown', _onKeyDown, false);
	window.addEventListener('keyup', _onKeyUp, false);

	function bind(scope, fn) {
		return function () {
			fn.apply(scope, arguments);
		};
	}
	this.handleResize();

};
