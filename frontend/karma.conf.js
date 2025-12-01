const webpackConfig = {
    mode: "development",
    devtool: "inline-source-map",
    module: {
    rules: [
        {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
            presets: [
                "@babel/preset-env",
                "@babel/preset-react"
            ]
            }
        }
        },
        {
        test: /\.css$/,
        use: "null-loader" // Ignora CSS en pruebas
        }
    ]
    },
    resolve: {
    extensions: [".js", ".jsx"],
    fallback: {
      // Ignora librerías pesadas que Karma no necesita
        "jspdf": false,
        "jspdf-autotable": false
    }
    }
};

module.exports = function (config) {
    config.set({
    frameworks: ["jasmine"],

    files: [
      // Polyfills y mocks de browser
        "node_modules/babel-polyfill/dist/polyfill.js",
        "node_modules/whatwg-fetch/dist/fetch.umd.js",
        { pattern: "src/tests/**/*.test.jsx", watched: false }
    ],

    preprocessors: {
        "src/tests/**/*.test.jsx": ["webpack", "sourcemap"]
    },

    webpack: webpackConfig,

    reporters: ["progress", "kjhtml"],

    browsers: ["ChromeHeadless"], // Mejor para evaluaciones o CI/CD

    singleRun: true, // Ejecuta y cierra

    client: {
        jasmine: {
        random: false,
        timeoutInterval: 8000 // Ayuda en pruebas asíncronas
        }
    },

    plugins: [
        "karma-webpack",
        "karma-jasmine",
        "karma-chrome-launcher",
        "karma-sourcemap-loader",
        "karma-jasmine-html-reporter"
    ]
    });
};
