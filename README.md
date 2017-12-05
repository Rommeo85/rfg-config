# Post data generator for RealFaviconGenerator API
 - Inspired by and originally from [evilebottnawi/favicons](https://github.com/evilebottnawi/favicons)
 - Extracted and reduced to work with the RealFaviconGenerator API only.

### Usage example
```js
// create config

// package.json information might be useful
const pkg = require('./package');

// can be also created by extending the default config: require('rfg-config').defaultConf
const conf = {
  appName: pkg.name,                  // Your application's name. `string`
  appDescription: pkg.description,    // Your application's description. `string`
  developerName: null,                // Your (or your developer's) name. `string`
  developerURL: null,                 // Your (or your developer's) URL. `string`
  background: '#fff',                 // Background colour for flattened icons. `string`
  path: '/',                          // Path for overriding default icons path. `string`
  display: 'browser',                 // Android display: "browser" or "standalone". `string`
  orientation: 'portrait',            // Android orientation: "portrait" or "landscape". `string`
  start_url: '/',                     // Android start application's URL. `string`
  version: pkg.version,               // Your application's version number. `number`
  icons: {
    // Platform Options:
    // - offset - offset in percentage
    // - shadow - drop shadow for Android icons, available online only
    // - background:
    //   * false - use default
    //   * true - force use default, e.g. set background for Android icons
    //   * color - set background for the specified icons
    //
    // e. g. to create Opera Coast icon with offset 25%:
    // coast: {
    //   offset: '25%'
    // }
    //
    android: true,                    // Create Android homescreen icon. `boolean` or `{ offset, background, shadow }`
    appleIcon: true,                  // Create Apple touch icons. `boolean` or `{ offset, background }`
    appleStartup: true,               // Create Apple startup images. `boolean` or `{ offset, background }`
    coast: true,                      // Create Opera Coast icon. `boolean` or `{ offset, background }`
    favicons: true,                   // Create regular favicons. `boolean`
    firefox: true,                    // Create Firefox OS icons. `boolean` or `{ offset, background }`
    windows: true,                    // Create Windows 8 tile icons. `boolean` or `{ background }`
    yandex: true                      // Create Yandex browser icon. `boolean` or `{ background }`
  }
};

// generate post data
const postData = require('rfg-config').createPost('path/to/logo.png', conf);

// post
const Client = require('node-rest-client').Client;
const client = new Client();
client.post('https://realfavicongenerator.net/api/favicon', postData, (data, response) => {
// ...
});
```
