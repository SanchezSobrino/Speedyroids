var module_name = b4w_ext.module_check('state_machine');
b4w.register(module_name, function(exports, require) {
    'use strict';

    var m_utils = require('utils');

    exports.create = create;
    function create() {
        return {
            nodes: [],
            instances:[],
            lock: false
        };
    }

    exports.add_state = add_state;
    function add_state(state_machine, id, allowed_ids, call_before_switch, call_after_switch,
                       call_switch_from, call_switch_to, init_state, payload) {
        state_machine.nodes.push({
            id: id,
            allowed_ids: allowed_ids,
            call_before_switch: call_before_switch,
            call_after_switch: call_after_switch,
            call_switch_from: call_switch_from,
            call_switch_to: call_switch_to,
            init_state: init_state,
            payload: payload,
            instances: []
        });
    }

    exports.validate = validate;
    function validate(state_machine) {
        var names = [];

        for (var i = 0; i < state_machine.nodes; i++) {
            var id = state_machine.nodes[i].id;
            if (names.indexOf(id) >= 0) {
                m_utils.log('Found states with the same id: ' + id);
                return false;
            } else {
                names.push(id);
            }
        }

        for (i = 0; i < state_machine.nodes; i++) {
            var node = state_machine.nodes[i];
            for (var j = 0; j < node.allowed_ids.length; j++) {
                if (names.indexOf(node.allowed_ids[j]) < 0) {
                    m_utils.log('Found bad id: ' + node.allowed_ids[j]);
                    return false;
                }
            }
        }

        return true;
    }

    exports.create_instance = create_instance;
    function create_instance(state_machine) {
        state_machine.instances.push({ current_node: null });

        var id = state_machine.instances.length - 1;
        for (var i = 0; i < state_machine.nodes.length; i++) {
            state_machine.nodes[i].instances.push({});
            if (state_machine.nodes[i].init_state)
                state_machine.nodes[i].init_state(state_machine.nodes[i], state_machine.nodes[i].instances.length - 1);
        }

        return id;
    }

    exports.set_start_node = set_start_node;
    function set_start_node(state_machine, node_id, instance_id) {
        var node = null;

        for (var i = 0; i < state_machine.nodes.length; i++) {
            if (state_machine.nodes[i].id == node_id) {
                node = state_machine.nodes[i];
                break;
            }
        }

        state_machine.instances[instance_id].current_node = node;
        return node;
    }

    exports.get_state = get_state;
    function get_state(state_machine, instance_id) {
        return state_machine.instances[instance_id].current_node;
    }

    exports.get_state_id = get_state_id;
    function get_state_id(state_machine, instance_id) {
        var curnode = state_machine.instances[instance_id].current_node;
        if (curnode)
            return curnode.id;
        else
            return undefined;
    }

    exports.get_allowed_transition = get_allowed_transition;
    function get_allowed_transition(state_machine, instance_id) {
        var state = get_state(state_machine, instance_id);
        if (state)
            return state.allowed_ids;
        else
            return undefined;
    }

    exports.switch_state = switch_state;
    function switch_state(state_machine, state, instance_id) {
        if (state_machine.lock) {
            m_utils.log('State machine is locked');
            return false;
        }
        var cur_state = get_state(state_machine, instance_id);
        var old_state = cur_state.id;
        if (cur_state.allowed_ids.indexOf(state) >= 0) {
            var before = true;
            if (cur_state.call_before_switch) {
                before = cur_state.call_before_switch(old_state, state, cur_state, null, instance_id);
            }
            if (before) {
                var eq = old_state == state;
                set_start_node(state_machine, state, instance_id);
                var new_state = get_state(state_machine, instance_id);
                if (cur_state.call_after_switch)
                    cur_state.call_after_switch(old_state, state, cur_state, new_state, instance_id);
                if (cur_state.call_switch_from)
                    cur_state.call_switch_from(eq, true, old_state, state, cur_state, new_state, instance_id);
                if (new_state.call_switch_to)
                    new_state.call_switch_to(eq, false, old_state, state, cur_state, new_state, instance_id);
                return true;
            } else {
                m_utils.log('Blocked by callback');
            }
        } else {
            m_utils.log('Transition is not allowed: ' + old_state + '->' + state);
        }
        return false;
    }
});
