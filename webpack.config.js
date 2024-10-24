const path = require('path')

module.exports = {
    entry: './src/main.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js', '.scss', '.css', '.html'],
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: 'html-loader',
            },

            {
                test: /\.module\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]__[hash:base64:5]',
                            },
                        },
                    },
                    'sass-loader',
                ],
            },

            {
                test: /\.s[ac]ss$/i,
                exclude: /\.module\.s[ac]ss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },

            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },

            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
        port: 3000,
    },
}
