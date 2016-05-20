
module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'non-blocking-array.js',
            'non-blocking-array.spec.js',
        ],
        exclude: [],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'non-blocking-array.js': ['coverage']
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        autoWatch: false,
        browsers: ['Chrome', 'Firefox'/*, 'IE'*/],
        singleRun: true,
        concurrency: Infinity,
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        }
    });
};
