const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, { mode }) => {
    const isProduction = mode === 'production';

    return {
        mode,
        entry: path.join(__dirname, 'src', 'index.tsx'),

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
            alias: {
                '@': path.resolve(__dirname, 'src/'),
            },
        },

        output: {
            publicPath: '/',
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? 'js/[name].[chunkhash].js' : 'js/[name].js',
            chunkFilename: isProduction ? 'js/[name].[chunkhash].js' : 'js/[name].js',
        },

        module: {
            rules: [
                {
                    test: /\.(ts|tsx)?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.?(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        },
                    },
                },
            ],
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'static', 'index.html'),
                minify: isProduction,
                hash: isProduction,
                cache: isProduction,
                showErrors: !isProduction,
            }),
        ],

        devtool: isProduction ? 'source-map' : 'inline-source-map',

        devServer: {
            host: '127.0.0.1',
            port: 3011,
            // server: 'https',
            historyApiFallback: true,
        },
    };
};