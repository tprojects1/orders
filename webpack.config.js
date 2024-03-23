const path = require('path');

module.exports = {
    entry: './src/index.js', // Your application entry point
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader', // Injects styles into DOM
                    {
                        loader: 'sass-loader',
                        options: {
                            // Optional: Set includePaths to search for @import directives
                            includePaths: [path.resolve(__dirname, 'src/styles')]
                        }
                    }
                ]
            }
        ]
    }
};
