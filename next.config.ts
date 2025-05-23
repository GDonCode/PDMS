// next.config.js
const path = require('path');

const nextConfig = {
  webpack(config: any) {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};

module.exports = nextConfig;
