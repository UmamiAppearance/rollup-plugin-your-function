import { createFilter } from "@rollup/pluginutils";
import MagicString from "magic-string";

function string(opts = {}) {
    if (!opts.include) {
        throw Error("include option must be specified");
    }

    const filter = createFilter(opts.include, opts.exclude);

    return {
        name: "manipulate",

        transform(code, id) {
            if (filter(id)) {
                let map;

                if (options.sourceMap !== false && options.sourcemap !== false) {
                    map = manager.code.generateMap({ hires: true });
                }

                return { code, map };
            }
        }
    };
}

export { string };
