const packageJSON = require("./package.json");

export default {
    input: `dist/index.js`,
    output: [{ file: packageJSON.main, format: "cjs" }]
};
