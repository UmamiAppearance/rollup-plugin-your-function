# rollup-plugin-your-function
[![License](https://img.shields.io/github/license/UmamiAppearance/rollup-plugin-your-function?color=009911&style=for-the-badge)](./LICENSE)
[![npm](https://img.shields.io/npm/v/rollup-plugin-your-function?color=009911&style=for-the-badge)](https://www.npmjs.com/package/rollup-plugin-your-function)

A very simple rollup-plugin, which gives you the opportunity to manipulate your build files as you like. Dead simple. The last plugin you need (for simple tasks).


## Idea
There are many plugins for rollup available. And many times the only thing you would like to perform is a little change. Now the big research begins: _which plugin fits the best?_  

Eventually you will find what you need, but now you'll have to figure out the particularities of the plugin. And you find yourself thinking: _"Why was that so complicated? I could have done this to a regular file in seconds!"_.  

This is where **rollup-plugin-your-function** comes into play. The _only!_ thing it does, is to take a function, that you create by yourself. Your function needs to take one argument, that is the source file, it must return the output code as the first parameter, optionally a sourcemap as a second. And that's it.


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

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should operate on. By default all files are targeted.


### `exclude`  
Type: `String` | `Array[...String]`  
Default: `null`  

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should _ignore_. By default no files are ignored.


### `fn`
Type: `Function`  
Default: `null`  

This is **your function**. Create a function _(sync or async)_ that takes one argument (the source input), optionally a second parameter can be provided to have access to the [options](#options).  
    
_The manipulated code can be returned as a:_
 - **string**
 - an **array** with the code at index ``0`` and an optional sourcemap at index ``1``
 - ``code`` and the optional ``map`` inside of an **object** (``{code: <code>, map: <map>}``).

```js
// Example A:
fn: source => {
    let code = source.replace("foo", "bar");
    return code;
}

// Example B:
fn: (source, options) => {
    let code = source.replace("foo", "bar");
    let map = mySourcemapGeneratingFN();

    if (options.id === "my-file") {
        console.log("my-file is currently getting processed");
    }
    
    return [ code, map ];
}

// Example C:
fn: source => {
    let code = source.replace("foo", "bar");
    let map = mySourcemapGeneratingFN();
    return { code, map };
}    
```
#### `options`
For global plugins, only the ``id`` is available (which is the filename). Output plugins also have access to the following parameters:
 - ``chunk``
 - ``outputOptions``
 - ``meta``  
  
More information on those parameters can be found at the [rollup documentation](https://github.com/rollup/rollup/blob/master/docs/05-plugin-development.md#renderchunk).


### `output`
Type: `Boolean`  
Default: `false`  

Set to ``true`` if you want **your function** to be passed to the output file.


### `showDiff`  
Type: `String`  
Default: `null`  

A debugging method. If set to anything other than the string `"file"` a console output of [diff](https://github.com/kpdecker/jsdiff) is shown. It is modified a little and looks much like the default output of diff from the [GNU diffutils](https://www.gnu.org/software/diffutils/), with colors on top. If set to `"file"` the whole file with insertions and deletions is shown. Either way it only gets logged if there are any changes at all. 


## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022, UmamiAppearance
