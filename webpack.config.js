const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  mode: 'development',
  entry: './test/js/index.tsx',
  output: {
    path: __dirname + '/test/dist',
    publicPath: '',
    filename: 'js/[name][chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.[tj](sx|s)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'test/tsconfig.json',
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
      },
    ],
  },
  watchOptions: {
    poll: 1000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      inject: false,
      template: 'test/index.ejs',
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
  devtool: 'source-map',
  devServer: {
    static: './test/dist',
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
};

module.exports = (_env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
  }
  return config;
};
