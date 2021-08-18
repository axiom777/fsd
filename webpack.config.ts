import * as path from 'path';
import * as fs from 'fs';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const PATH = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
};

const mode = process.env.NODE_ENV as Configuration['mode'];
const isDev = mode === 'development';

const pages = fs.readdirSync(path.resolve(PATH.src, 'pages'));

const config: Configuration = {
  mode,
  entry: { index: path.resolve(PATH.src, 'index.ts') },
  output: {
    path: PATH.dist,
    filename: '[name].js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: PATH.dist,
    port: 9000,
    hot: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader', 'eslint-loader'],
        exclude: [path.resolve(__dirname, 'node_modules')],
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: isDev,
          root: PATH.src,
        },
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [path.resolve(PATH.src, 'common', 'colors.scss')],
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        exclude: [path.resolve(PATH.src, 'fonts')],
        generator: {
          filename: 'assets/images/[name].[ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        include: [path.resolve(PATH.src, 'fonts')],
        generator: {
          filename: 'assets/fonts/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          template: path.resolve(PATH.src, 'pages', page, `${page}.pug`),
          filename: `${page}.html`,
        }),
    ),
  ],
};

export default config;
