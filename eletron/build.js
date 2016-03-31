var packager = require('electron-packager');
var config = require('../package.json');

packager({
    dir: './',
    out: './dist',
    name: config.name,
    platform: 'win32',
    arch: 'ia32',
    'app-bundle-id': 'com.rageapp',
    'app-version': config.version,
    overwrite: true,
    //asar: true,
    prune: true,
    ignore: "node_modules/(electron-packager|electron-prebuilt|\.bin)|build\.js",
    'version-string': {
        CompanyName: 'RageApp',
        FileDescription: 'Web Socket Testing',
        OriginalFilename: config.name,
        FileVersion: config.version,
        ProductVersion: config.version,
        ProductName: config.name,
        InternalName: config.name
    }
}, function done(err, appPath) {
    if (err) {
        throw new Error(err);
    }
    console.log('Done!!');
});
