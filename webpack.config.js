const {
  share,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');
const config = withModuleFederationPlugin({
  // For remotes (please adjust)
  name: 'DocumentRemoteModule',
  filename: 'remoteEntry.js',
  exposes: {
    './DocumentRemoteModule': './src/app/remote.module.ts',
  },

  // For hosts (please adjust)
  // remotes: {
  //     "mfe1": "http://localhost:3000/remoteEntry.js",

  // },

  shared: share({
    '@angular/core': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
    '@angular/common': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
    '@angular/common/http': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
    '@angular/router': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
    },
    '@onecx/portal-integration-angular': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@onecx/keycloak-auth': {
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@ngx-translate/core': {
      singleton: true,
      strictVersion: false,
    },
    // ...sharedMappings.getDescriptors(),
  }),
});
module.exports = config;
