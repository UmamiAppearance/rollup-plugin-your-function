'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginutils = require('@rollup/pluginutils');
var MagicString = require('magic-string');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var MagicString__default = /*#__PURE__*/_interopDefaultLegacy(MagicString);

const manipulate = (options={}) => {
    
    /*
    if (!opts.include) {
        throw Error("include option must be specified");
    }
    */

    if (!options.fn) {
        throw Error("A function must be specified");
    }

    const filter = pluginutils.createFilter(options.include, options.exclude);

    return {
        name: "manipulate",

        transform(source, id) {
            if (filter(id)) {
                
                const code = options.fn(source);
                
                let map;

                if (options.sourceMap !== false && options.sourcemap !== false) {
                    const ms = new MagicString__default["default"](code);
                    map = ms.generateMap({ hires: true });
                }

                return { code, map };
            }
        }
    };
};

exports.manipulate = manipulate;
//# sourceMappingURL=manipulate.cjs.map
