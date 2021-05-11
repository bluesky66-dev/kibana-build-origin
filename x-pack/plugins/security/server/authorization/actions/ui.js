"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UIActions = void 0;

var _lodash = require("lodash");

var _server = require("../../../../features/server");

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

class UIActions {
  constructor(versionNumber) {
    _defineProperty(this, "prefix", void 0);

    this.prefix = `ui:${versionNumber}:`;
  }

  get(featureId, ...uiCapabilityParts) {
    if (!featureId || !(0, _lodash.isString)(featureId)) {
      throw new Error('featureId is required and must be a string');
    }

    if (!uiCapabilityParts || !Array.isArray(uiCapabilityParts)) {
      throw new Error('uiCapabilityParts is required and must be an array');
    }

    if (uiCapabilityParts.length === 0 || uiCapabilityParts.findIndex(part => !part || !(0, _lodash.isString)(part) || !_server.uiCapabilitiesRegex.test(part)) >= 0) {
      throw new Error(`UI capabilities are required, and must all be strings matching the pattern ${_server.uiCapabilitiesRegex}`);
    }

    return `${this.prefix}${featureId}/${uiCapabilityParts.join('/')}`;
  }

}

exports.UIActions = UIActions;