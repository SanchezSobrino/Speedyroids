(function() {
    'use strict';

    if (b4w.module_check(Config.PROJECT_NAME))
        throw 'Failed to register module: ' + Config.PROJECT_NAME;

    b4w.register(Config.PROJECT_NAME, function(exports, require) {
        var m_app = require('app');
        var m_data = require('data');
        var m_cfg = require('config');
        var m_preloader = require("preloader");

        var quality = m_cfg.P_HIGH;
        if (Config.QUALITY === 'low') {
            quality = m_cfg.P_LOW;
        }
        else if (Config.QUALITY === 'medium') {
            quality = m_cfg.P_HIGH;
        }
        else if (Config.QUALITY === 'high') {
            quality = m_cfg.P_ULTRA;
        }

        exports.init = function() {
            m_app.init({
                canvas_container_id: 'canvas-container',
                callback: init_cb,
                show_fps: Config.SHOW_FPS,
                console_verbose: true,
                autoresize: true,
                quality: quality
            });
        };

        function init_cb(canvas_elem, success) {
            if (!success) {
                console.log('b4w init failure');
                return;
            }

            // Ignore right-click on the canvas element
            canvas_elem.oncontextmenu = function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            };

            load();
        }

        function load() {
            m_preloader.create_preloader({
                container_color: '#222',
                bar_color: '#444',
                frame_color: '#666',
                font_color: '#ddd'
            });

            m_data.load('speedyroids.json', load_cb, preloader_cb);
        }

        function load_cb(data_id) {
            m_app.enable_camera_controls();

            // TODO
        }

        function preloader_cb(percentage) {
            m_preloader.update_preloader(percentage);
        }
    });

    var game = b4w.require(Config.PROJECT_NAME);
    game.init();
})();
