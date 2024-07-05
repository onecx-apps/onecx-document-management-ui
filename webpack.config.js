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
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@onecx/keycloak-auth': {
      requiredVersion: 'auto',
      includeSecondaries: true,
    },
    '@ngx-translate/core': {
      singleton: true,
      strictVersion: false,
      requiredVersion: '^14.0.0'
    },
    '@onecx/accelerator': {
      requiredVersion: 'auto',
      includeSecondaries: true,
  },
  '@onecx/integration-interface': {
      requiredVersion: 'auto',
      includeSecondaries: true,
  },
    // ...sharedMappings.getDescriptors(),
  }),
  sharedMappings: ['@onecx/portal-integration-angular'],
});
module.exports = config;
