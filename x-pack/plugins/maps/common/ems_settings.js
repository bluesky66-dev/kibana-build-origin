"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMSSettings = void 0;

var _common = require("../../../../src/plugins/maps_legacy/common");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class EMSSettings {
  constructor(config, getIsEnterPrisePlus) {
    _defineProperty(this, "_config", void 0);

    _defineProperty(this, "_getIsEnterprisePlus", void 0);

    this._config = config;
    this._getIsEnterprisePlus = getIsEnterPrisePlus;
  }

  isEMSUrlSet() {
    return !!this._config.emsUrl;
  }

  getEMSRoot() {
    return this._config.emsUrl.replace(/\/$/, '');
  }

  isIncludeElasticMapsService() {
    return !!this._config.includeElasticMapsService;
  }

  hasOnPremLicense() {
    return this._getIsEnterprisePlus();
  }

  isEMSEnabled() {
    if (this.isEMSUrlSet()) {
      return this._getIsEnterprisePlus();
    }

    return this.isIncludeElasticMapsService();
  }

  getEMSFileApiUrl() {
    if (this._config.emsFileApiUrl !== _common.DEFAULT_EMS_FILE_API_URL || !this.isEMSUrlSet()) {
      return this._config.emsFileApiUrl;
    } else {
      return `${this.getEMSRoot()}/file`;
    }
  }

  isProxyElasticMapsServiceInMaps() {
    return !!this._config.proxyElasticMapsServiceInMaps;
  }

  getEMSTileApiUrl() {
    if (this._config.emsTileApiUrl !== _common.DEFAULT_EMS_TILE_API_URL || !this.isEMSUrlSet()) {
      return this._config.emsTileApiUrl;
    } else {
      return `${this.getEMSRoot()}/tile`;
    }
  }

  getEMSLandingPageUrl() {
    if (this._config.emsLandingPageUrl !== _common.DEFAULT_EMS_LANDING_PAGE_URL || !this.isEMSUrlSet()) {
      return this._config.emsLandingPageUrl;
    } else {
      return `${this.getEMSRoot()}/maps`;
    }
  }

  getEMSFontLibraryUrl() {
    if (this._config.emsFontLibraryUrl !== _common.DEFAULT_EMS_FONT_LIBRARY_URL || !this.isEMSUrlSet()) {
      return this._config.emsFontLibraryUrl;
    } else {
      return `${this.getEMSRoot()}/tile/fonts/{fontstack}/{range}.pbf`;
    }
  }

}

exports.EMSSettings = EMSSettings;