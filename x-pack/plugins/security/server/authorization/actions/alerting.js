"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertingActions = void 0;

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

class AlertingActions {
  constructor(versionNumber) {
    _defineProperty(this, "prefix", void 0);

    this.prefix = `alerting:${versionNumber}:`;
  }

  get(alertTypeId, consumer, operation) {
    if (!alertTypeId || !(0, _lodash.isString)(alertTypeId)) {
      throw new Error('alertTypeId is required and must be a string');
    }

    if (!operation || !(0, _lodash.isString)(operation)) {
      throw new Error('operation is required and must be a string');
    }

    if (!consumer || !(0, _lodash.isString)(consumer)) {
      throw new Error('consumer is required and must be a string');
    }

    return `${this.prefix}${alertTypeId}/${consumer}/${operation}`;
  }

}

exports.AlertingActions = AlertingActions;