var b4w_ext = {};

(function() {
    'use strict';

    b4w_ext.module_check = function(module_name) {
        if (b4w.module_check(module_name))
            throw 'Failed to register module: ' + module_name;

        return module_name;
    };
})();
