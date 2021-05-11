"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MaxSizeStringBuilder = void 0;

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
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class MaxSizeStringBuilder {
  constructor(maxSizeBytes, bom = '') {
    _defineProperty(this, "_buffer", void 0);

    _defineProperty(this, "_size", void 0);

    _defineProperty(this, "_maxSize", void 0);

    _defineProperty(this, "_bom", void 0);

    this._buffer = Buffer.alloc(maxSizeBytes);
    this._size = 0;
    this._maxSize = maxSizeBytes;
    this._bom = bom;
  }

  tryAppend(str) {
    const byteLength = Buffer.byteLength(str);

    if (this._size + byteLength <= this._maxSize) {
      this._buffer.write(str, this._size);

      this._size += byteLength;
      return true;
    }

    return false;
  }

  getSizeInBytes() {
    return this._size;
  }

  getString() {
    return this._bom + this._buffer.slice(0, this._size).toString();
  }

}

exports.MaxSizeStringBuilder = MaxSizeStringBuilder;