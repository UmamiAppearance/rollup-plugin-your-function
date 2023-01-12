/**
 * [rollup-plugin-your-function]{@link https://github.com/UmamiAppearance/rollup-plugin-your-function}
 *
 * @version 0.4.9
 * @author UmamiAppearance [mail@umamiappearance.eu]
 * @license MIT
 */

import { createFilter } from "@rollup/pluginutils";
import MagicString from "magic-string";
import showDiff from "./diff.js";


const yourFunction = (settings={}) => {

    if (!settings.fn) {
        throw Error("A function must be provided.");
    }

    const filter = createFilter(settings.include, settings.exclude);
    
    const plugin = {
        name: settings.name
            ? String(settings.name)
            : "your-function"
    };

    const fnWrap = async (source, options) => {

        if (!filter(options.id)) return null;
  
        let [ code, map ] = [].concat(await settings.fn(source, options));
        
        if (typeof code === "object") {
            map = code.map;
            code = code.code;
        }

        if ("showDiff" in settings && code !== source) {
            showDiff(options.id, source, code, settings.showDiff, plugin.name);
        }
        
        if (settings.sourceMap !== false && settings.sourcemap !== false) {
            if (!map) {
                const ms = new MagicString(code);
                map = ms.generateMap({ hires: true });
            }
        } else {
            map = undefined;
        }

        return { code, map };
    };


    if (settings.output) { 
        plugin.renderChunk = async (source, chunk, outputOptions, meta) => {
            return await fnWrap(
                source,
                {
                    id: chunk.fileName,
                    chunk,
                    outputOptions,
                    meta
                }
            );
        };
    }

    else {
        plugin.transform = async (source, id) => {
            return await fnWrap(
                source,
                { id }
            );
        };
    }

    return plugin;    
};

export { yourFunction };
