import test from "ava";
import { rollup } from "rollup";
import { yourFunction } from "../src/your-function.js";


test("manually replace a string for a build file (sync)", async (t) => {

    const replacement = "saluton mondo!";
    const bundle = await rollup({
        input: "./test/fixtures/hello.js",
        plugins: [
            yourFunction({
                fn: source => {
                    return { code: source.replace("hello world!", replacement) };
                }
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
                    await sleep(100);
                    return source.replace("hello world!", replacement);
                }
            })
        ]
    });

    const { output } = await bundle.generate({ format: "es" });

    t.true(output[0].code.indexOf(replacement) > -1);
});


test("create an output plugin.", async (t) => {

    const replacement = "saluton mondo!";
    const bundle = await rollup({
        input: "./test/fixtures/hello.js",
    });

    const { output } = await bundle.generate({
        format: "es",
        plugins: [
            yourFunction({
                fn: source => source.replace("hello world!", replacement),
                output: true
            })
        ]
    });

    t.true(output[0].code.indexOf(replacement) > -1);
});
