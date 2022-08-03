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
                
                const code = options.fn(source);

                if ("showDiff" in options && code !== source) {
                    showDiff(id, source, code, options.showDiff);
                }
                
                let map;

                if (options.sourceMap !== false && options.sourcemap !== false) {
                    const ms = new MagicString(code);
                    map = ms.generateMap({ hires: true });
                }

                return { code, map };
            }
        }
    };
}

export { yourFunction };
