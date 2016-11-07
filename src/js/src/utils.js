var module_name = b4w_ext.module_check('utils');
b4w.register(module_name, function(exports, require) {
    'use strict';

    var m_game_config = require('game_config');

    exports.log = function(msg) {
        if (m_game_config.DEBUG) {
            console.log(msg);
        }
    };
});
