var PlayState = {
    init: function(require, canvas_elem) {
        this._$canvas = $(canvas_elem);

        this._initModules(require);
        this._initObjects();
        this._initControls();
    },

    _initModules: function(require) {
        this._appModule = require('app');
        this._camModule = require('camera');
        this._contModule = require('container');
        this._ctrlModule = require('controls');
        this._dataModule = require('data');
        this._mouseModule = require('mouse');
        this._mathModule = require('math');
        this._objModule = require('objects');
        this._physModule = require('physics');
        this._preloaderModule = require('preloader');
        this._quatModule = require('quat');
        this._scenesModule = require('scenes');
        this._transModule = require('transform');
        this._utilModule = require('util');
        this._vec3Module  = require('vec3');
    },

    _initObjects: function() {
        this._shipObject = this._scenesModule.get_object_by_name('ShipCollider');
        this._physModule.set_gravity(this._shipObject, 0.0);
        this._physModule.apply_velocity(this._shipObject, 0.0, 0.0, 0.0);
        this._shipSpeedX = 10.0;
        this._shipSpeedY = 10.0;
    },

    _initControls: function() {
        var keyW = this._ctrlModule.create_keyboard_sensor(this._ctrlModule.KEY_W),
            keyA = this._ctrlModule.create_keyboard_sensor(this._ctrlModule.KEY_A),
            keyS = this._ctrlModule.create_keyboard_sensor(this._ctrlModule.KEY_S),
            keyD = this._ctrlModule.create_keyboard_sensor(this._ctrlModule.KEY_D),
            mouseMove = this._ctrlModule.create_mouse_move_sensor();

        var controlSensors = [keyW, keyA, keyS, keyD, mouseMove];
        var movementLogic = function(s) { return s[0] || s[1] || s[2] || s[3]; };
        var aimLogic = function(s) { return s[4]; };

        function controlFunc(obj, id, pulse) {
            var dirX = 0,
                dirY = 0;

            if (pulse === 1) {
                if (id === 'MOVEMENT') {
                    dirY = this._ctrlModule.get_sensor_value(obj, id, 0);
                    dirX = -this._ctrlModule.get_sensor_value(obj, id, 1);
                    dirY = !!this._ctrlModule.get_sensor_value(obj, id, 2) ? -1 : dirY;
                    dirX = !!this._ctrlModule.get_sensor_value(obj, id, 3) ? 1 : dirX;
                }
            }


            // TODO: Optimize it
            var objPos = this._transModule.get_translation(obj);
            objPos[2] = 0.0;
            var objPosNormalized = this._vec3Module.create();
            this._vec3Module.normalize(objPos, objPosNormalized);

            var mousePosCanvas = this._ctrlModule.get_sensor_payload(obj, id, 4);

            // Emit ray from the camera
            var cam = this._scenesModule.get_active_camera();
            var plineTmp = this._mathModule.create_pline();
            var pline = this._camModule.calc_ray(cam, mousePosCanvas[0], mousePosCanvas[1], plineTmp);
            var vec3Tmp1 = this._vec3Module.create();
            var camera_ray = this._mathModule.get_pline_directional_vec(pline, vec3Tmp1);

            // Calculate ray/floor plane intersection point
            var vec3Tmp2 = this._vec3Module.create();
            var cam_trans = this._transModule.get_translation(cam, vec3Tmp2);
            this._mathModule.set_pline_initial_point(pline, cam_trans);
            this._mathModule.set_pline_directional_vec(pline, camera_ray);
            var vec3Tmp = this._vec3Module.create();
            var point = this._mathModule.line_plane_intersect([0, 0, 1], 0, pline, vec3Tmp);

            var mousePosNormalized = this._vec3Module.create();
            this._vec3Module.normalize(point, mousePosNormalized);

            var angle = Math.acos(this._vec3Module.dot(objPosNormalized, mousePosNormalized));
            console.log(angle * (180/3.1415926));
            var rotationQuat = this._quatModule.create();
            this._utilModule.euler_to_quat([0.0, 0.0, angle], rotationQuat);

            var quatTmp = this._quatModule.create();
            this._transModule.get_rotation(obj, quatTmp);
            this._quatModule.multiply(quatTmp, rotationQuat, quatTmp);
            this._transModule.set_rotation_v(obj, quatTmp);

            if (id === 'MOVEMENT') {
                this._physModule.apply_force_world(obj, this._shipSpeedX * dirX, this._shipSpeedY * dirY, 0.0);
            }
        }

        this._ctrlModule.create_sensor_manifold(this._shipObject, 'MOVEMENT', this._ctrlModule.CT_CONTINUOUS,
                                                controlSensors, movementLogic, controlFunc.bind(this));
        this._ctrlModule.create_sensor_manifold(this._shipObject, 'AIM', this._ctrlModule.CT_CONTINUOUS,
                                                controlSensors, aimLogic, controlFunc.bind(this));
    },

    exit: function() {
        this._$canvas.off();
    }
};
