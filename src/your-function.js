/**
 * [rollup-plugin-your-function]{@link https://github.com/UmamiAppearance/rollup-plugin-yor-function}
 *
 * @version 0.2.0
 * @author UmamiAppearance [mail@umamiappearance.eu]
 * @license MIT
 */

import { createFilter } from "@rollup/pluginutils";
import MagicString from "magic-string";
import showDiff from "./diff.js";

const yourFunction = (options={}) => {

    if (!options.fn) {
        throw Error("A function must be specified");
    }

    const filter = createFilter(options.include, options.exclude);

    return {
        name: "manipulate",

        transform(source, id) {
            if (filter(id)) {
                
                let [ code, map ] = [].concat(options.fn(source));

                if ("showDiff" in options && code !== source) {
                    showDiff(id, source, code, options.showDiff);
                }
                
                if (options.sourceMap !== false && options.sourcemap !== false) {
                    if (!map) {
                        const ms = new MagicString(code);
                        map = ms.generateMap({ hires: true });
                    }
                } else {
                    map = undefined;
                }

                return { code, map };
            }
        }
    };
};

export { yourFunction };
