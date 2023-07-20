/* eslint-disable @typescript-eslint/naming-convention */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appId: 'onecx-document-management-ui',
  KEYCLOAK_REALM: 'OneCX',
  KEYCLOAK_URL: 'http://keycloak-app',
  DISABLE_PERMISSION_CHECK: 'true',
  TKIT_PORTAL_ID: 'ADMIN',
  KEYCLOAK_CLIENT_ID: 'onecx-document-management-ui',
  API_BASE_PATH: './api/event',
  skipRemoteConfigLoad: true,
  portal: 'portal',
  TKIT_PORTAL_THEME_SERVER_URL:
    'https://portal-theme-management-onecx.test.1000kit.net',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
