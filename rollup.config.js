import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
    input: "src/index.ts", // Entry point of your library
    output: [
        {
            file: "dist/index.cjs.js", // Output file for CommonJS
            format: "cjs", // CommonJS format
            sourcemap: true, // Generate source maps
        },
        {
            file: "dist/index.esm.js", // Output file for ES Module
            format: "esm", // ES Module format
            sourcemap: true, // Generate source maps
        },
    ],
    plugins: [
        resolve(), // Resolve node_modules
        commonjs(), // Convert CommonJS modules to ES6
        typescript(), // Compile TypeScript
        terser(), // Minify the output
    ],
};
