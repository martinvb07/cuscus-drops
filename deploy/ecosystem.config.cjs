module.exports = {
  apps: [
    {
      name: "cuscus-backend",
      cwd: "/var/www/cuscus/backend",
      script: "src/index.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 4001,
      },
      restart_delay: 3000,
      max_restarts: 10,
    },
    {
      name: "cuscus-frontend",
      cwd: "/var/www/cuscus/frontend",
      script: "node_modules/.bin/next",
      args: "start --port 3001",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
