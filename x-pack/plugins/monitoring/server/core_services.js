"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CoreServices = void 0;

var _server = require("../../../../src/core/server");

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

class CoreServices {
  static init(core) {
    this._coreSetup = core;
  }

  static get coreSetup() {
    this.checkError();
    return this._coreSetup;
  }

  static async getCoreStart() {
    if (this._coreStart) {
      return this._coreStart;
    }

    const [coreStart] = await this.coreSetup.getStartServices();
    this._coreStart = coreStart;
    return coreStart;
  }

  static async getUISetting(key) {
    const coreStart = await this.getCoreStart();
    const {
      savedObjects,
      uiSettings
    } = coreStart;
    const savedObjectsClient = new _server.SavedObjectsClient(savedObjects.createInternalRepository());
    const theSettings = uiSettings.asScopedToClient(savedObjectsClient);
    return await theSettings.get(key);
  }

  static checkError() {
    if (!this._coreSetup) {
      throw new Error('CoreServices has not been initialized. Please run CoreServices.init(...) before use');
    }
  }

}

exports.CoreServices = CoreServices;

_defineProperty(CoreServices, "_coreSetup", void 0);

_defineProperty(CoreServices, "_coreStart", void 0);