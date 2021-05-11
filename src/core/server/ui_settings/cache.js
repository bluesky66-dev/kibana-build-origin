"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cache = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const oneSec = 1000;
const defMaxAge = 5 * oneSec;
/**
 * @internal
 */

class Cache {
  /**
   * Delete cached value after maxAge ms.
   */
  constructor(maxAge = defMaxAge) {
    this.maxAge = maxAge;

    _defineProperty(this, "value", void 0);

    _defineProperty(this, "timer", void 0);

    this.value = null;
  }

  get() {
    return this.value;
  }

  set(value) {
    this.del();
    this.value = value;
    this.timer = setTimeout(() => this.del(), this.maxAge);
  }

  del() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.value = null;
  }

}

exports.Cache = Cache;