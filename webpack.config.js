const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { default: test } = require('node:test')
const { type } = require('os')
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
    entry: './src/main.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/', // Путь к статическим ресурсам
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
                use: ['style-loader', 'css-loader'], // Обработка CSS файлов
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource', // используем asset/resource для Webpack 5
                generator: {
                    filename: 'assets/images/[name][hash][ext]', // куда сохранять
                },
            },
        ],
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'), // Папка для статических файлов
        },
        port: 3000,
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // укажите путь к вашему шаблону
            filename: 'index.html',
            inject: true, // автоматически вставляет ссылки на сгенерированные скрипты
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/assets', to: 'assets' }, // копируем папку assets из public в dist
            ],
        }),
    ],
}
