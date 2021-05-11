"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subject = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class Subject {
  constructor(value) {
    _defineProperty(this, "callbacks", new Set());

    _defineProperty(this, "value", void 0);

    this.value = value;
  }

  subscribe(fn) {
    this.callbacks.add(fn);
    /**
     * We immediately call the function inside the subscribe so the consumer
     * receives the value immediately, withouth the need to wait for a change.
     */

    fn(this.value);

    const unsubscribe = () => this.callbacks.delete(fn);

    return {
      unsubscribe
    };
  }

  next(value) {
    if (value !== this.value) {
      this.value = value;
      this.callbacks.forEach(fn => fn(value));
    }
  }

}

exports.Subject = Subject;