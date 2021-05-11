"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.MapsLegacyPlugin = exports.config = void 0;

var _config = require("../config");

var _ui_settings = require("./ui_settings");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const config = {
  exposeToBrowser: {
    includeElasticMapsService: true,
    proxyElasticMapsServiceInMaps: true,
    tilemap: true,
    regionmap: true,
    manifestServiceUrl: true,
    emsUrl: true,
    emsFileApiUrl: true,
    emsTileApiUrl: true,
    emsLandingPageUrl: true,
    emsFontLibraryUrl: true,
    emsTileLayerId: true
  },
  schema: _config.configSchema
};
exports.config = config;

class MapsLegacyPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "_initializerContext", void 0);

    this._initializerContext = initializerContext;
  }

  setup(core) {
    core.uiSettings.register((0, _ui_settings.getUiSettings)());

    const pluginConfig = this._initializerContext.config.get();

    return {
      config: pluginConfig
    };
  }

  start() {}

}

exports.MapsLegacyPlugin = MapsLegacyPlugin;

const plugin = initializerContext => new MapsLegacyPlugin(initializerContext);

exports.plugin = plugin;