import test from "ava";
import { rollup } from "rollup";
import { yourFunction } from "../src/your-function.js";


test("manually replace a string for a build file (sync)", async (t) => {

    const replacement = "saluton mondo!";
    const bundle = await rollup({
        input: "./test/fixtures/hello.js",
        plugins: [
            yourFunction({
                fn: source => source.replace("hello world!", replacement)
            })
        ]
    });

    const { output } = await bundle.generate({ format: "es" });

    t.true(output[0].code.indexOf(replacement) > -1);
});


test("manually replace a string for a build file (async)", async (t) => {

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const replacement = "saluton mondo!";
    const bundle = await rollup({
        input: "./test/fixtures/hello.js",
        plugins: [
            yourFunction({
                fn: async source => {
                    await sleep(200);
                    return source.replace("hello world!", replacement);
                }
            })
        ]
    });

    const { output } = await bundle.generate({ format: "es" });

    t.true(output[0].code.indexOf(replacement) > -1);
});
