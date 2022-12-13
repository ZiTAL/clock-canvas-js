const path = require('path');

module.exports = {
    entry: {
        app: ['@babel/polyfill', './src/index.js']
    },
    output:
    {
        filename: "clock.min.js",
        path: path.resolve(__dirname, 'dist')
    },
    module:
    {
        rules:
        [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.css$/,
                use:
                [
                    "style-loader",
                    "css-loader"
                ]
            }            
        ]
    }
}