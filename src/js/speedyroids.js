(function() {
    "use strict";

    var project_name = 'speedyroids';
    if (b4w.module_check(project_name))
        throw 'Failed to register module: ' + project_name;

    b4w.register(project_name, function(exports, require) {
        var m_app = require('app');
        var m_data = require('data');
        var m_cfg = require("config");

        exports.init = function() {
            m_app.init({
                canvas_container_id: 'canvas-container',
                callback: init_cb,
                show_fps: true,
                console_verbose: true,
                autoresize: true,
                quality: m_cfg.P_HIGH
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
            m_data.load('speedyroids.json', load_cb);
        }

        function load_cb(data_id) {
            m_app.enable_camera_controls();

            // TODO
        }
    });

    b4w.require(project_name).init();
})();
