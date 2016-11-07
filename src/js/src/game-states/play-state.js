var module_name = b4w_ext.module_check('play_state');
b4w.register(module_name, function(exports, require) {
    'use strict';

    var m_camera = require('camera');
    var m_controls = require('controls');
    var m_data = require('data');
    var m_math = require('math');
    var m_physics = require('physics');
    var m_quat = require('quat');
    var m_scenes = require('scenes');
    var m_transform = require('transform');
    var m_util = require('util');
    var m_vec3  = require('vec3');

    var m_main_entry = require('main_entry');
    var m_ship = require('ship');

    var _tmp_pline = m_math.create_pline();
    var _tmp_vec3 = m_vec3.create();
    var _tmp_vec3_2 = m_vec3.create();

    var _mouse_position = m_vec3.create();

    exports.on_enter = function(event, from, to) {
        m_data.load(
            'scenes/Play.json',
            function(data_id) {
                init();
            },
            m_main_entry.preloader_cb
        );
    };

    exports.on_leave = function(event, from, to) {

    };

    function init() {
        init_entities();
        init_sensors();
    }

    function init_entities() {
        m_ship.init();
    }

    function init_sensors() {
        init_movement_sensors();
        init_aim_sensors();
    }

    function init_movement_sensors() {
        var key_w = m_controls.create_keyboard_sensor(m_controls.KEY_W);
        var key_a = m_controls.create_keyboard_sensor(m_controls.KEY_A);
        var key_s = m_controls.create_keyboard_sensor(m_controls.KEY_S);
        var key_d = m_controls.create_keyboard_sensor(m_controls.KEY_D);

        m_controls.create_sensor_manifold(
            m_ship.object(),
            'MOVEMENT',
            m_controls.CT_CONTINUOUS,
            [key_w, key_a, key_s, key_d],
            function(s) {
                return s[0] || s[1] || s[2] || s[3];
            },
            function(obj, id, pulse) {
                var dir_x = 0;
                var dir_y = 0;

                if (pulse === 1) {
                    dir_y = m_controls.get_sensor_value(obj, id, 0);
                    dir_x = -m_controls.get_sensor_value(obj, id, 1);
                    dir_y = !!m_controls.get_sensor_value(obj, id, 2) ? -1 : dir_y;
                    dir_x = !!m_controls.get_sensor_value(obj, id, 3) ? 1 : dir_x;
                }

                m_ship.move(dir_x, dir_y);
            }
        );
    }

    function init_aim_sensors() {
        var mouse_sensor = m_controls.create_mouse_move_sensor();
        var touch_click_sensor = m_controls.create_touch_click_sensor();
        var touch_move_sensor = m_controls.create_touch_move_sensor();
        var aim_sensor = m_controls.create_elapsed_sensor();

        var aim_target_func = function(obj, id, pulse) {
            if (pulse === 1) {
                var target_position = m_controls.get_sensor_payload(obj, id, 0).coords;

                // Emit ray from the camera
                var cam = m_scenes.get_active_camera();
                var pline = m_camera.calc_ray(cam, target_position[0], target_position[1], _tmp_pline);
                var camera_ray = m_math.get_pline_directional_vec(pline, _tmp_vec3);

                // Calculate ray/floor plane intersection point
                var cam_trans = m_transform.get_translation(cam, _tmp_vec3_2);
                m_math.set_pline_initial_point(pline, cam_trans);
                m_math.set_pline_directional_vec(pline, camera_ray);
                _mouse_position = m_math.line_plane_intersect(m_util.AXIS_Z, 0, pline, _tmp_vec3_2);
            }
        };

        m_controls.create_sensor_manifold(
            m_ship.object,
            'MOUSE',
            m_controls.CT_CONTINUOUS,
            [mouse_sensor],
            function(s) {
                return s[0];
            },
            aim_target_func
        );

        m_controls.create_sensor_manifold(
            m_ship.object,
            'TOUCH',
            m_controls.CT_CONTINUOUS,
            [touch_click_sensor, touch_move_sensor],
            function(s) {
                return s[0] != s[1];
            },
            aim_target_func
        );

        m_controls.create_sensor_manifold(
            m_ship.object,
            'AIM',
            m_controls.CT_CONTINUOUS,
            [aim_sensor],
            function(s) {
                return s[0];
            },
            function(obj, id, pulse) {
                m_ship.look_at(_mouse_position);
            }
        );
    }
});
