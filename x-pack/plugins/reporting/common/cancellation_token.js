"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancellationToken = void 0;

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

class CancellationToken {
  constructor() {
    _defineProperty(this, "_isCancelled", void 0);

    _defineProperty(this, "_callbacks", void 0);

    _defineProperty(this, "on", callback => {
      if (!(0, _lodash.isFunction)(callback)) {
        throw new Error('Expected callback to be a function');
      }

      if (this._isCancelled) {
        callback();
        return;
      }

      this._callbacks.push(callback);
    });

    _defineProperty(this, "cancel", () => {
      this._isCancelled = true;

      this._callbacks.forEach(callback => callback());
    });

    this._isCancelled = false;
    this._callbacks = [];
  }

  isCancelled() {
    return this._isCancelled;
  }

}

exports.CancellationToken = CancellationToken;