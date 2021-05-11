"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectActions = void 0;

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

class SavedObjectActions {
  constructor(versionNumber) {
    _defineProperty(this, "prefix", void 0);

    this.prefix = `saved_object:${versionNumber}:`;
  }

  get(type, operation) {
    if (!type || !(0, _lodash.isString)(type)) {
      throw new Error('type is required and must be a string');
    }

    if (!operation || !(0, _lodash.isString)(operation)) {
      throw new Error('operation is required and must be a string');
    }

    return `${this.prefix}${type}/${operation}`;
  }

}

exports.SavedObjectActions = SavedObjectActions;