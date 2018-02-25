module.exports = {
    entry: './src/main',
    output: {
        path: 'dist/',
        filename: 'main.js',
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        require.resolve('babel-preset-es2015'),
                        require.resolve('babel-preset-stage-2')
                    ]
                }
            }
        ]
    }
};
