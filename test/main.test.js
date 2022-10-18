import test from "ava";
import { rollup } from "rollup";
import { yourFunction } from "../src/your-function.js";


test("manually replace a string for a build file", async (t) => {

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
