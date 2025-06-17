module.exports = {
  apps: [
    {
      name: "node-app",
      script: "./dist/index.js",
      instances: "max", // Cluster mode, one per CPU core
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
