/**
 * [rollup-plugin-your-function]{@link https://github.com/UmamiAppearance/rollup-plugin-your-function}
 *
 * @version 0.5.0
 * @author UmamiAppearance [mail@umamiappearance.eu]
 * @license MIT
 */

import { createFilter } from "@rollup/pluginutils";
import { diffChars } from "diff";
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

                // If no Source Map was provided generate one, by
                // comparing character by character with the help
                // of diff and using the output to apply the changes
                // to the source with the help of magic string. 

                const ms = new MagicString(source);
                let i = 0;
                
                for (const diff of diffChars(source, code)) {

                    if (diff.added) {
                        ms.appendRight(i, diff.value);
                    } else if (diff.removed) {
                        ms.remove(i, i+=diff.count);
                    } else {
                        i += diff.count;
                    }
                }

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
