"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiActions = void 0;

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

class ApiActions {
  constructor(versionNumber) {
    _defineProperty(this, "prefix", void 0);

    this.prefix = `api:${versionNumber}:`;
  }

  get(operation) {
    if (!operation || !(0, _lodash.isString)(operation)) {
      throw new Error('operation is required and must be a string');
    }

    return `${this.prefix}${operation}`;
  }

}

exports.ApiActions = ApiActions;