var PlayState = {
    init: function(require, canvas_elem) {
        this._$canvas = $(canvas_elem);

        this._bindDOMEvents();

        this._initModules(require);
        this._initObjects();
        this._initControls();
    },

    _bindDOMEvents: function() {
        this._$canvas.on('mousemove', this._onMouseMove.bind(this));
        this._$canvas.on('touchmove', this._onMouseMove.bind(this));
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
        this._scenesModule = require('scenes');
        this._transModule = require('transform');
        this._utilModule = require('util');
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
                } else if (id === 'AIM') {
                    var moveSensorPayload = this._ctrlModule.get_sensor_payload(obj, id, 4);
                    var objPos = this._transModule.get_translation(obj);
                    // TODO: Aim at mouse cursor
                }
            }

            if (id === 'MOVEMENT') {
                this._physModule.apply_force_world(obj, this._shipSpeedX * dirX, this._shipSpeedY * dirY, 0.0);
            }
        }

        this._ctrlModule.create_sensor_manifold(this._shipObject, 'MOVEMENT', this._ctrlModule.CT_CONTINUOUS,
                                                controlSensors, movementLogic, controlFunc.bind(this));
        this._ctrlModule.create_sensor_manifold(this._shipObject, 'AIM', this._ctrlModule.CT_CONTINUOUS,
                                                controlSensors, aimLogic, controlFunc.bind(this));
    },

    _onMouseMove: function() {

    },

    exit: function() {
        this._$canvas.off();
    }
};
