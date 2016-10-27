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
        this._fighterObject = this._scenesModule.get_object_by_name('FighterCollider');
        this._physModule.set_gravity(this._fighterObject, 0.0);
        this._fighterSpeedX = 1.0;
        this._fighterSpeedY = 1.0;
    },

    _initControls: function() {
        var keyW = this._ctrlModule.create_keyboard_sensor(this._ctrlModule.KEY_W);
        var keyA = this._ctrlModule.create_keyboard_sensor(this._ctrlModule.KEY_A);
        var keyS = this._ctrlModule.create_keyboard_sensor(this._ctrlModule.KEY_S);
        var keyD = this._ctrlModule.create_keyboard_sensor(this._ctrlModule.KEY_D);

        var keySensors = [keyW, keyA, keyS, keyD];
        var movementLogic = function(s) { return s[0] || s[1] || s[2] || s[3]; };

        function movementFunc(obj, id, pulse) {
            if (pulse == 1) {
                if (id === this._ctrlModule.KEY_W) {
                    this._physModule.apply_velocity_world(obj, 0.0, this._fighterSpeedY, 0.0);
                } else if (id === this._ctrlModule.KEY_A) {
                    this._physModule.apply_velocity_world(obj, -this._fighterSpeedX, 0.0, 0.0);
                } else if (id === this._ctrlModule.KEY_S) {
                    this._physModule.apply_velocity_world(obj, 0.0, -this._fighterSpeedY, 0.0);
                } else if (id === this._ctrlModule.KEY_D) {
                    this._physModule.apply_velocity_world(obj, this._fighterSpeedX, 0.0, 0.0);
                }
            }
            else {
                this._physModule.apply_velocity_world(obj, 0.0, 0.0, 0.0);
            }
        }

        this._ctrlModule.create_kb_sensor_manifold(this._fighterObject, this._ctrlModule.KEY_W,
                                                   this._ctrlModule.CT_TRIGGER,
                                                   this._ctrlModule.KEY_W, movementFunc.bind(this));
        this._ctrlModule.create_kb_sensor_manifold(this._fighterObject, this._ctrlModule.KEY_A,
                                                   this._ctrlModule.CT_TRIGGER,
                                                   this._ctrlModule.KEY_A, movementFunc.bind(this));
        this._ctrlModule.create_kb_sensor_manifold(this._fighterObject, this._ctrlModule.KEY_S,
                                                   this._ctrlModule.CT_TRIGGER,
                                                   this._ctrlModule.KEY_S, movementFunc.bind(this));
        this._ctrlModule.create_kb_sensor_manifold(this._fighterObject, this._ctrlModule.KEY_D,
                                                   this._ctrlModule.CT_TRIGGER,
                                                   this._ctrlModule.KEY_D, movementFunc.bind(this));
    },

    _onMouseMove: function() {

    },

    exit: function() {
        this._$canvas.off();
    }
};
