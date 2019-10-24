module.exports = {
    entry: './src/app/index.jsx',
    output: {
        path: __dirname + '/build',
        filename: 'meal-planner.js'
    },
    resolve: {
        extensions: ['.js','.jsx']
    },
    optimization: {
        minimize: false
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react','es2015'],
                    plugins: ['transform-object-rest-spread']
                }
            }
        ]
    }
};