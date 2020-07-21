
var path = require('path');

module.exports = {
    mode: 'production',
    entry: "./src/calculaPrazo/index.js",
    output: {
        path: path.resolve( __dirname,'lib'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    }, 
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: ['source-map-loader'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env','@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                // test: /\.css$/i,
                // // use: ['style-loader', 'css-loader'],
                // use: ['isomorphic-style-loader', { loader: 'css-loader' }]
                test: /\.css$/,
                use: [
                'isomorphic-style-loader',
                {
                    loader: 'css-loader',
                    options: {
                    importLoaders: 1
                    }
                },
                'postcss-loader'
                ]
              }
        ]
    }
}