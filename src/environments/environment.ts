// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend: 'https://localhost:443/graphql',
  backendWs: 'wss://localhost:443/graphql',
  stripePublicKey: 'pk_test_51LcAKpKmpYSfXVu3pcVivi8Yb5D9Rm359Uzl94jUsJgtzrHxyQHUyZPgyGqrwTLje73HwDrxRQZzbvQFVkhS534g004XdS4vSN',
  upload: 'https://localhost:443/upload',
  uploadsUrl: 'https://localhost:443/uploads',
  demo: 'demo30',
  SERVER_URL: '' // SERVER_URL: 'http://localhost:4200'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
