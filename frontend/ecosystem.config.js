const fs = require('fs');
const path = require('path');

// Manually read and parse .env.local to ensure 100% bulletproof injection
const envPath = path.resolve(__dirname, '.env.local');
const envVariables = {};

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    // Remove Windows carriage returns (\r) that might be attached to the end of the line
    const cleanLine = line.replace(/\r/g, '');
    const match = cleanLine.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      value = value.replace(/(^['"]|['"]$)/g, ''); // Remove surrounding quotes
      envVariables[key] = value;
    }
  });
}

module.exports = {
  apps: [
    {
      name: "getmyhelp",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        ...envVariables // Inject parsed variables directly into Node process
      },
    },
  ],
};
