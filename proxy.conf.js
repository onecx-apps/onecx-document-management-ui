const bypassFn = function (req, res, proxyOptions) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, HEAD, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    //return 'index.html'
    return res.send('');
  } else {
    return null;
  }
};
const PROXY_CONFIG = {
  '/tkit-document-management-api': {
    target: 'http://localhost:8084',
    secure: false,
    pathRewrite: {
      '^/tkit-document-management-api': '',
    },
    bypass: bypassFn,
  },
  '/portal-api': {
    target: 'http://tkit-portal-server/',
    secure: false,
    pathRewrite: {
      '^/portal-api': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassFn,
  },
  '/launchpad-api': {
    target: 'http://localhost:9000',
    secure: false,
    pathRewrite: {
      '^/launchpad-api': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassFn,
  },
  '/ahm-api': {
    target: 'http://localhost:9000',
    secure: false,
    pathRewrite: {
      '^/ahm-api': '',
    },
    changeOrigin: true,
    logLevel: 'debug',
    bypass: bypassFn,
  },
};
module.exports = PROXY_CONFIG;
