// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend: 'https://apidev.daru.mx:3001/graphql',
  backendWs: 'wss://apidev.daru.mx:3001/graphql',
  stripePublicKey: 'pk_test_51NYXA6CQE0nb8Ka8LtAclE1JaXZxjpgF7V7oO8Bab8NXVQhkQx5uF7qiWod8VZu2KB1CiI7Y2VKq412v0k8OoyDy00tSs0cZDB',
  upload: 'https://apidev.daru.mx:3001/uploads',
  uploadsUrl: 'https://apidev.daru.mx:3001/uploads',
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
