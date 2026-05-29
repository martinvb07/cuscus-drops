module.exports = {
  apps: [
    {
      name: "cuscus-drop-backend",
      cwd: "/var/www/cuscus-drop/backend",
      script: "src/index.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 4002,
      },
      restart_delay: 3000,
      max_restarts: 10,
    },
    {
      name: "cuscus-drop-frontend",
      cwd: "/var/www/cuscus-drop/frontend",
      script: "node_modules/.bin/next",
      args: "start --port 3003",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
