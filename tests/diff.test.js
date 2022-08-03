import test from "ava";
import { rollup } from "rollup";
import { yourFunction } from "../src/your-function.js";


test.before(t => {
    t.context.data = [];
    console.log = (...args) => t.context.data.push(args);
});

test.beforeEach(t => {
    t.context.data.length = 0;
});

const replacement = "saluton mondo!";


test.serial("showDiff method (default)", async (t) => {

    await rollup({
        input: "./tests/fixtures/hello.js",
        plugins: [
            yourFunction({
                showDiff: null,
                fn: source => source.replace("hello world!", replacement)
            })
        ]
    }); 

    
    t.context.data.shift();

    t.truthy(
        t.context.data.filter(l => l[0].indexOf("(plugin manipulate) diff for file") > -1).length
    );

    t.truthy(
        t.context.data.filter(l => l[0].indexOf("console.log(\"saluton mondo!\")") > -1).length
    );
});



test.serial("showDiff method (file)", async (t) => {

    await rollup({
        input: "./tests/fixtures/hello.js",
        plugins: [
            yourFunction({
                showDiff: "file",
                fn: source => source.replace("hello world!", replacement)
            })
        ]
    }); 

    t.context.data.shift();

    t.truthy(
        t.context.data.filter(l => l[0].indexOf("(plugin manipulate) diff for file") > -1).length
    );

    t.truthy(
        t.context.data.filter(l => l[0].indexOf("console.log(\"saluton mondo!\")") > -1).length
    );

    t.truthy(
        t.context.data.filter(l => l[0].indexOf("export default helloWorld") > -1).length
    );
});
