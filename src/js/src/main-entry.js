var module_name = b4w_ext.module_check('main_entry');
b4w.register(module_name, function(exports, require) {
    'use strict';

    var m_app = require('app');
    var m_config = require('config');
    var m_preloader = require('preloader');

    var m_utils = require('utils');
    var m_game_config = require('game_config');
    var m_game_states = require('game_states');

    exports.init = function() {
        var quality = m_config.P_ULTRA;
        if (m_game_config.QUALITY === 'low') {
            quality = m_config.P_LOW;
        } else if (m_game_config.QUALITY === 'medium') {
            quality = m_config.P_HIGH;
        } else if (m_game_config.QUALITY === 'high') {
            quality = m_config.P_ULTRA;
        }

        m_app.init({
            canvas_container_id: 'canvas-container',
            callback: init_cb,
            show_fps: m_game_config.SHOW_FPS,
            console_verbose: true,
            autoresize: true,
            quality: quality,
            physics_enabled: true
        });
    };

    function init_cb(canvas_elem, success) {
        if (!success) {
            m_utils.log('b4w init failure');
            return;
        }

        // Ignore right-click on the canvas element
        canvas_elem.oncontextmenu = function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        load(canvas_elem);
    }

    function load(canvas_elem) {
        m_preloader.create_preloader({
            container_color: '#222',
            bar_color: '#444',
            frame_color: '#666',
            font_color: '#ddd'
        });

        m_game_states.init();
        m_game_states.change_state(m_game_states.states.MENU);
    }

    exports.preloader_cb = preloader_cb;
    function preloader_cb(percentage) {
        m_preloader.update_preloader(percentage);
    }
});

b4w.require(module_name).init();
