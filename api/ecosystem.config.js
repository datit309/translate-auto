module.exports = {
    apps: [
        {
            id: 0,
            name: 'BE-API',
            script: './dist/main.js',
            watch: false,
            autorestart: true,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
}
