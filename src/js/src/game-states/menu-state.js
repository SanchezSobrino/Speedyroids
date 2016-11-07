var module_name = b4w_ext.module_check('menu_state');
b4w.register(module_name, function(exports, require) {
    'use strict';

    var m_game_states = require('game_states');

    exports.on_enter = function(event, from, to) {
        // TODO: Bypassing this state
        m_game_states.change_state(m_game_states.states.PLAY);
    };

    exports.on_leave = function(event, from, to) {

    };

    exports.init = function() {

    };
});
