// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    baseUrl: 'http://localhost:8841/api/',
    url: 'http://localhost:8841',
    imagesUrl: 'http://localhost:8841/assets/images/',
    currentUser: 'currentUser',
    userProfile: 'userProfile',
    lastRequest: 'lastRequest',
    lang: 'lang',
    menu: 'menu',
    pullListFirends: false,
    splitImageMarketing: 1
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
