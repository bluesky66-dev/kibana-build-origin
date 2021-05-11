"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProxyConfigCollection = void 0;

var _lodash = require("lodash");

var _url = require("url");

var _proxy_config = require("./proxy_config");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProxyConfigCollection {
  constructor(configs = []) {
    _defineProperty(this, "configs", void 0);

    this.configs = configs.map(settings => new _proxy_config.ProxyConfig(settings));
  }

  hasConfig() {
    return Boolean(this.configs.length);
  }

  configForUri(uri) {
    const parsedUri = (0, _url.parse)(uri);
    const settings = this.configs.map(config => config.getForParsedUri(parsedUri));
    return (0, _lodash.defaultsDeep)({}, ...settings);
  }

}

exports.ProxyConfigCollection = ProxyConfigCollection;