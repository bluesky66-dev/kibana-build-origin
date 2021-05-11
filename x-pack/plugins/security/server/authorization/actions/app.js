"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppActions = void 0;

var _lodash = require("lodash");

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

class AppActions {
  constructor(versionNumber) {
    _defineProperty(this, "prefix", void 0);

    this.prefix = `app:${versionNumber}:`;
  }

  get(appId) {
    if (!appId || !(0, _lodash.isString)(appId)) {
      throw new Error('appId is required and must be a string');
    }

    return `${this.prefix}${appId}`;
  }

}

exports.AppActions = AppActions;