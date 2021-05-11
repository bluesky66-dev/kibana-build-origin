"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Globals = void 0;

var _url = _interopRequireDefault(require("url"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

const keyStoreData = {};

const getKeyStoreValue = (key, storeValueMethod) => {
  const value = keyStoreData[key];

  if ((value === undefined || value == null) && typeof storeValueMethod === 'function') {
    keyStoreData[key] = storeValueMethod();
  }

  return keyStoreData[key];
};

class Globals {
  static init(coreSetup, cloud, monitoringCluster, config, getLogger) {
    const {
      protocol,
      hostname,
      port
    } = coreSetup.http.getServerInfo();
    const pathname = coreSetup.http.basePath.serverBasePath;
    Globals._app = {
      url: _url.default.format({
        protocol,
        hostname,
        port,
        pathname
      }),
      isCloud: (cloud === null || cloud === void 0 ? void 0 : cloud.isCloudEnabled) || false,
      monitoringCluster,
      config,
      getLogger,
      getKeyStoreValue
    };
  }

  static get app() {
    if (!Globals._app) {
      throw new Error('Stack Monitoring: App globals needs to be initiated with Globals.init(...) before use');
    }

    return Globals._app;
  }

}

exports.Globals = Globals;

_defineProperty(Globals, "_app", void 0);