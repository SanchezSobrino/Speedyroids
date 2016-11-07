var module_name = b4w_ext.module_check('ship');
b4w.register(module_name, function(exports, require) {
    'use strict';

    var m_physics = require('physics');
    var m_quat = require('quat');
    var m_scenes = require('scenes');
    var m_transform = require('transform');
    var m_util = require('util');
    var m_vec3 = require('vec3');

    var _ship_object = null;
    var _speed_x = 0.0;
    var _speed_y = 0.0;

    var _tmp_vec3 = m_vec3.create();
    var _tmp_quat = m_quat.create();

    var _look_at_origin = m_vec3.create();

    exports.init = function() {
        _ship_object = m_scenes.get_object_by_name('ShipCollider');
        _speed_x = 10.0;
        _speed_y = 10.0;
        _look_at_origin = m_util.quat_to_dir(m_quat.create(), m_util.AXIS_Y);

        m_physics.set_gravity(_ship_object, 0.0);
        m_physics.apply_velocity(_ship_object, 0.0, 0.0, 0.0);
    };

    exports.move = function(dir_x, dir_y) {
        m_physics.apply_force_world(_ship_object, _speed_x * dir_x, _speed_y * dir_y, 0.0);
    };

    exports.look_at = function(position) {
        var obj_pos = m_transform.get_translation(_ship_object);
        var direction = m_vec3.subtract(position, obj_pos, _tmp_vec3);
        direction[2] = 0.0;
        m_vec3.normalize(direction, _tmp_vec3);  // Normalize should not modify the input vector itself, but actually it does so
        var rotation_quat = m_quat.rotationTo(_look_at_origin, direction, _tmp_quat);

        m_transform.set_rotation_v(_ship_object, rotation_quat);

        return m_vec3.length(direction);
    };

    exports.object = function() {
        return _ship_object;
    };
});
