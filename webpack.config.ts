import * as webpack from 'webpack';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as webpackDevServer from 'webpack-dev-server';

const isDev = process.env.ENV === 'DEVELOPMENT';
const isProd = process.env.ENV === 'PRODUCTION';

const getFilename = (ext: string) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

interface IWebpackConfig extends webpack.Configuration {
    devServer: webpackDevServer.Configuration;
}

const config: IWebpackConfig = {
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    entry: ['./src/ts/index.ts', './src/scss/index.scss'],
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `./js/${getFilename('js')}`,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader', 'babel-loader'],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                include: path.resolve(__dirname, 'src/scss'),
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    minimize: true,
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        new MiniCssExtractPlugin({
            filename: `./css/${getFilename('css')}`,
            chunkFilename: '[id].css',
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
};

export default config;
