/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");

const srcDir = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "dist", "types");

function copyDTSFiles(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDTSFiles(srcPath, destPath);
        } else if (entry.isFile() && entry.name.endsWith(".d.ts")) {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

copyDTSFiles(srcDir, distDir);
