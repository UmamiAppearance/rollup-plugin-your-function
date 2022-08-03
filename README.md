# rollup-plugin-your-function
[![License](https://img.shields.io/github/license/UmamiAppearance/rollup-plugin-your-function?color=009911&style=for-the-badge)](./LICENSE)
[![npm](https://img.shields.io/npm/v/rollup-plugin-your-function?color=009911&style=for-the-badge)](https://www.npmjs.com/package/rollup-plugin-your-function)

A very simple rollup-plugin, which gives you the opportunity to manipulate your build files as you like. Dead simple. The last plugin you need (for simple tasks).


## Idea
There are many plugins for rollup available. And many times the only thing you would like to perform is a little change. Now the big research begins: _which plugin fits the best?_  

Eventually you will find what you need, but now you'll have to figure out the particularities of the plugin. And you find yourself thinking: _"Why was that so complicated? I could have done this to a regular file in seconds!"_.  

This is where **rollup-plugin-your-function** comes into play. The _only!_ thing it does, is to take a function, that you create by yourself. Your function needs to take one argument, that is the source file, and must return the output code. And that's it.


## Install
Using npm:
```console
npm install rollup-plugin-your-function --save-dev
```


## Usage
Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin.

```js
import { yourFunction } from "rollup-plugin-your-function";

export default {
    input: "src/index.js",
    output: {   
        format: "es",
        name: "myBuild",
        file: "./dist/build.js",
    },
    plugins: [
        yourFunction({
            fn: source => {
                let code = source.replace("foo", "bar");
                code += "baz";
                return code;
            }
        })
    ]
}
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the [API](https://www.rollupjs.org/guide/en/#javascript-api).


## Options

### `include`  
Type: `String` | `Array[...String]`  
Default: `null`  

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should operate on. By default all files are targeted. On top of that each unit has the possibility to [target a specific file](#file-option-for-units).


### `exclude`  
Type: `String` | `Array[...String]`  
Default: `null`  

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should _ignore_. By default no files are ignored.


### `fn`
Type: `Function`  
Default: `null`  

This is **your function**. Create a function that takes one argument (the source input) and returns the manipulated code as a string. 


### `showDiff`  
Type: `String`  
Default: `null`  

A debugging method. If set to anything other than the string `"file"` a console output of [diff](https://github.com/kpdecker/jsdiff) is shown. It is modified a little and looks much like the default output of diff from the [GNU diffutils](https://www.gnu.org/software/diffutils/), with colors on top. If set to `"file"` the whole file with insertions and deletions is shown. Either way it only gets logged if there are any changes at all. 

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022, UmamiAppearance
