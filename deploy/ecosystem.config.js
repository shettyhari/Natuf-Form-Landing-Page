// PM2 process file. On the server, from the release/ folder:
//   cd backend && npm install --omit=dev && cd ..
//   pm2 start ../deploy/ecosystem.config.js   (or copy this file next to release/)
//   pm2 save && pm2 startup

module.exports = {
  apps: [
    {
      name: "natuf-landing",
      cwd: __dirname + "/../release/backend",
      script: "server.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
