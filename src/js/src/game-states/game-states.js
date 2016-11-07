var module_name = b4w_ext.module_check('game_states');
b4w.register(module_name, function(exports, require) {
    'use strict';


    var m_utils = require('utils');
    var m_menu_state = require('menu_state');
    var m_play_state = require('play_state');
    var m_game_over_state = require('game_over_state');

    var _states = {
        START: 'start',
        MENU: 'menu',
        PLAY: 'play',
        GAME_OVER: 'game_over'
    };
    exports.states = _states;

    var _fsm = null;

    exports.init = function() {
        var events = [];
        add_transition(events, _states.START, _states.MENU);
        add_transition(events, _states.MENU, _states.PLAY);
        add_transition(events, _states.PLAY, _states.MENU);
        add_transition(events, _states.PLAY, _states.GAME_OVER);
        add_transition(events, _states.GAME_OVER, _states.PLAY);
        add_transition(events, _states.GAME_OVER, _states.MENU);

        var callbacks = {};
        add_callback(callbacks, 'onenter', _states.MENU, m_menu_state.on_enter);
        add_callback(callbacks, 'onleave', _states.MENU, m_menu_state.on_leave);
        add_callback(callbacks, 'onenter', _states.PLAY, m_play_state.on_enter);
        add_callback(callbacks, 'onleave', _states.PLAY, m_play_state.on_leave);
        add_callback(callbacks, 'onenter', _states.GAME_OVER, m_game_over_state.on_enter);
        add_callback(callbacks, 'onleave', _states.GAME_OVER, m_game_over_state.on_leave);

        _fsm = StateMachine.create({
            initial: _states.START,
            events: events,
            callbacks: callbacks
        });
    };

    exports.change_state = function(to) {
        var event = _fsm.current + ' => ' + to;
        m_utils.log('Changing state: ' + event);
        _fsm[event]();
    };

    function add_transition(events, from, to) {
        events.push({
            name: from + ' => ' + to,
            from: from,
            to: to
        });
    }

    function add_callback(callbacks, type, state, func_cb) {
        callbacks[type + state] = func_cb;
    }
});
