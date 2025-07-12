const path = require("path");

module.exports = {
    // Basic entry and output for Webpack
    entry: "./src/index.js", // or your actual entry point
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },

    resolve: {
        fallback: {
            fs: false,
            crypto: false,
            os: false,
        },
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader", // if you're using Babel
                },
            },
        ],
    },
};
