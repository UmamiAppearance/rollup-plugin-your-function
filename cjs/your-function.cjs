'use strict';

var pluginutils = require('@rollup/pluginutils');
var diff = require('diff');
var MagicString = require('magic-string');
var colorette = require('colorette');

/**
 * Adds an angle bracket to each line of a
 * text section.
 * @param {string} angle - '>' or '<'
 * @param {string} txt - The text section.
 * @returns {string} - The given text section with an angle bracket and a space in front of each line. 
 */
const addAngles = (angle, txt) => {
    const txtArr = txt.split("\n");
    let lastChar = "";
    if (txt.at(-1) === "\n") {
        lastChar = "\n";
        txtArr.pop();
    }
    let output = txtArr.map(line => `${angle} ${line}`).join("\n");
    output += lastChar;
    return output;
};


/**
 * Prints an output in the mould of GNU diff when
 * called with no parameters other than the files.
 * But more picturesque, thanks to red and green
 * colors...
 * Also possible is a "file" mode. This variant
 * shows the whole file with added and removed
 * lines.
 * @param {string} source - The original code.
 * @param {string} code - The modified code.
 * @param {string} [diffOption] - As passed by the user. If the value is 'file' also unchanged code is printed.  
 */
const showDiff = (filename, source, code, diffOption, pluginName) => {
    const fileMode = diffOption == "file";

    console.log(colorette.bold(colorette.blue(
        `(plugin ${pluginName}) diff for file '${filename}':`
    )));
    
    console.log(colorette.gray("BEGIN >>>"));

    if (fileMode) {
        const diff$1 = diff.diffLines(source, code);

        let message = "";
        
        diff$1.forEach((part) => {
            let msg;
            if (part.added) {
                msg = colorette.green(addAngles(">", part.value));
            } else if (part.removed) {
                msg = colorette.red(addAngles("<", part.value));
            } else {
                msg = part.value;
            }
            message += msg;
        });
        
        console.log(message);
    
    }
        
    else {
        const diff$1 = diff.structuredPatch("", "", source, code, "", "", {
            context: 0
        });
        
        for (const part of diff$1.hunks) {

            // add
            if (part.oldLines === 0) {
                let info = `${part.oldStart}a${part.newStart}`;
                if (part.newLines > 1) {
                    info += `,${part.newStart+part.newLines-1}`;
                }
                console.log(colorette.bold(info));
                part.lines.forEach(line => console.log(colorette.green(`> ${line.slice(1)}`)));
            }
            
            // delete
            else if (part.newLines === 0) {
                let info = String(part.oldStart);
                if (part.oldLines > 1) {
                    info += `,${part.oldStart+part.oldLines-1}`;
                }
                info += `d${part.newLines}`;
                console.log(colorette.bold(info));
                part.lines.forEach(line => console.log(colorette.red(`< ${line.slice(1)}`)));
            }
            
            // change
            else {
                let info = String(part.oldStart);
                if (part.oldLines > 1) {
                    info += `,${part.oldStart+part.oldLines-1}`;
                }
                info += `c${part.newStart}`;
                if (part.newLines > 1) {
                    info += `,${part.newStart+part.newLines-1}`;
                }
                console.log(colorette.bold(info));
                
                let plus = false;
                part.lines.forEach((line, i) => {
                    if (plus) {
                        console.log(colorette.green(`> ${line.slice(1)}`));
                    } else {
                        console.log(colorette.red(`< ${line.slice(1)}`));
                        if (part.lines[i+1].at(0) === "+") {
                            console.log("---");
                            plus = true;
                        }
                    }
                });
            }
        }
    }
     
    console.log(colorette.gray("<<< END\n"));
};

/**
 * [rollup-plugin-your-function]{@link https://github.com/UmamiAppearance/rollup-plugin-your-function}
 *
 * @version 0.5.1
 * @author UmamiAppearance [mail@umamiappearance.eu]
 * @license MIT
 */

const yourFunction = (settings={}) => {

    if (!settings.fn) {
        throw Error("A function must be provided.");
    }

    const filter = pluginutils.createFilter(settings.include, settings.exclude);
    
    const plugin = {
        name: settings.name
            ? String(settings.name)
            : "your-function"
    };

    const fnWrap = async (source, options, context) => {

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

                let error = false;
                const errorCase = (e) => {
                    error = true;
                    let msg = "Automatic source map generation failed, or produced an inaccurate result. If you need a proper source map, you should provide it manually, otherwise you can ignore this message.";
                    if (e) {
                        msg = `${msg}\n___\n${e}`;
                    }
                    context.warn(msg);
                };

                const ms = new MagicString(source);
                let i = 0;
                
                for (const diff$1 of diff.diffChars(source, code)) {

                    if (diff$1.added) {
                        try {
                            ms.appendRight(i, diff$1.value);
                        } catch(e) {
                            errorCase(e);
                            break;
                        }
                    }
                    
                    else if (diff$1.removed) {
                        try {
                            ms.remove(i, i+=diff$1.count);
                        } catch(e) {
                            errorCase(e);
                            break;
                        }
                    }
                    
                    else {
                        i += diff$1.count;
                    }
                }

                // Test if the code output of the magic string instance
                // matches the output provided by the user 
                if (!error && ms.toString() !== code) {
                    errorCase();
                }

                map = ms.generateMap({ hires: true });
            }
        } else {
            map = undefined;
        }

        return { code, map };
    };


    if (settings.output) { 
        plugin.renderChunk = async function(source, chunk, outputOptions, meta) {
            return await fnWrap(
                source,
                {
                    id: chunk.fileName,
                    chunk,
                    outputOptions,
                    meta
                },
                this
            );
        };
    }

    else {
        plugin.transform = async function(source, id) {
            return await fnWrap(
                source,
                { id },
                this
            );
        };
    }

    return plugin;    
};

exports.yourFunction = yourFunction;
//# sourceMappingURL=your-function.cjs.map
