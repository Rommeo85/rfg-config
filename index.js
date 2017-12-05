const fs = require('fs');
const PLATFORM_OPTIONS = require('./config/platform-options.json');
const ANDROID_BASE_SIZE = 36;
const IOS_BASE_SIZE = 57;
const IOS_STARTUP_BASE_SIZE = 320;
const COAST_BASE_SIZE = 228;
const FIREFOX_BASE_SIZE = 60;

function each (object, handler) {
  Object.keys(object).forEach(key => handler(object[key], key));
}

function preparePlatformOptions (platform, options, baseOptions) {
  if (typeof options !== 'object') {
    options = {};
  }

  each(options, (value, key) => {
    const platformOptionsRef = PLATFORM_OPTIONS[key];

    if (typeof platformOptionsRef === 'undefined' || platformOptionsRef.platforms.indexOf(platform) === -1) {
      delete options[key];
    }
  });

  each(PLATFORM_OPTIONS, ({ platforms, defaultTo }, key) => {
    if (typeof options[key] === 'undefined' && platforms.indexOf(platform) !== -1) {
      options[key] = defaultTo;
    }
  });

  if (typeof options.background === 'boolean') {

    if (platform === 'android' && !options.background) {
      options.background = 'transparent';
    } else {
      options.background = baseOptions.background;
    }
  }

  if (platform === 'android' && options.background !== 'transparent') {
    options.disableTransparency = true;
  }

  return options;
}

function processSrc (src) {
  let masterPictureObject = {};

  if (/^https?:\/\//i.test(src)) {
    masterPictureObject.type = 'url';
    masterPictureObject.url = src;
  }
  else {
    masterPictureObject.type = 'inline';
    masterPictureObject.content = fs.readFileSync(src, { encoding: null }).toString('base64');
  }

  return masterPictureObject;
}

module.exports = {
  defaultConf: require('./config/default'),
  createPost (src, options) {
    let postData = require('./config/request');
    postData.master_picture = processSrc(src);
    postData.files_location.path = options.path;

    if (options.icons.android) {
      const androidOptions = preparePlatformOptions('android', options.icons.android, options);

      postData.favicon_design.android_chrome.theme_color = options.background;
      postData.favicon_design.android_chrome.manifest.name = options.appName;
      postData.favicon_design.android_chrome.manifest.display = options.display;
      postData.favicon_design.android_chrome.manifest.orientation = options.orientation;

      if (androidOptions.shadow) {
        postData.favicon_design.android_chrome.picture_aspect = 'shadow';
      } else if (androidOptions.offset > 0 && androidOptions.background) {
        postData.favicon_design.android_chrome.picture_aspect = 'background_and_margin';
        postData.favicon_design.android_chrome.background_color = androidOptions.background;
        postData.favicon_design.android_chrome.margin = Math.round(ANDROID_BASE_SIZE / 100 * androidOptions.offset);
      }

    } else {
      delete postData.favicon_design['android_chrome'];
    }

    if (options.icons.appleIcon) {
      const appleIconOptions = preparePlatformOptions('appleIcon', options.icons.appleIcon, options);

      postData.favicon_design.ios.background_color = appleIconOptions.background;
      postData.favicon_design.ios.margin = Math.round(IOS_BASE_SIZE / 100 * appleIconOptions.offset);
    } else {
      delete postData.favicon_design['ios'];
    }

    if (options.icons.appleIcon && options.icons.appleStartup) {
      const appleStartupOptions = preparePlatformOptions('appleStartup', options.icons.appleStartup, options);

      postData.favicon_design.ios.startup_image.background_color = appleStartupOptions.background;
      postData.favicon_design.ios.startup_image.margin = Math.round(IOS_STARTUP_BASE_SIZE / 100 * appleStartupOptions.offset);
    } else if (postData.favicon_design.ios) {
      delete postData.favicon_design.ios['startup_image'];
    }

    if (options.icons.coast) {
      const coastOptions = preparePlatformOptions('coast', options.icons.coast, options);

      postData.favicon_design.coast.background_color = coastOptions.background;
      postData.favicon_design.coast.margin = Math.round(COAST_BASE_SIZE / 100 * coastOptions.offset);
    } else {
      delete postData.favicon_design['coast'];
    }

    if (!options.icons.favicons) {
      delete postData.favicon_design['desktop_browser'];
    }

    if (options.icons.firefox) {
      const firefoxOptions = preparePlatformOptions('firefox', options.icons.firefox, options);

      postData.favicon_design.firefox_app.background_color = firefoxOptions.background;
      postData.favicon_design.firefox_app.margin = Math.round(FIREFOX_BASE_SIZE / 100 * firefoxOptions.offset);
      postData.favicon_design.firefox_app.manifest.app_name = options.appName;
      postData.favicon_design.firefox_app.manifest.app_description = options.appDescription;
      postData.favicon_design.firefox_app.manifest.developer_name = options.developerName;
      postData.favicon_design.firefox_app.manifest.developer_url = options.developerURL;
    } else {
      delete postData.favicon_design['firefox_app'];
    }

    if (options.icons.windows) {
      const windowsOptions = preparePlatformOptions('windows', options.icons.windows, options);

      postData.favicon_design.windows.background_color = windowsOptions.background;
    } else {
      delete postData.favicon_design['windows'];
    }

    if (options.icons.yandex) {
      const yandexOptions = preparePlatformOptions('yandex', options.icons.yandex, options);

      postData.favicon_design.yandex_browser.background_color = yandexOptions.background;
      postData.favicon_design.yandex_browser.manifest.version = options.version;
    } else {
      delete postData.favicon_design['yandex_browser'];
    }

    return postData;
  }
};