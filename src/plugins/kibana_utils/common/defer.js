"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defer = exports.Defer = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * An externally resolvable/rejectable "promise". Use it to resolve/reject
 * promise at any time.
 *
 * ```ts
 * const future = new Defer();
 *
 * future.promise.then(value => console.log(value));
 *
 * future.resolve(123);
 * ```
 */
class Defer {
  constructor() {
    _defineProperty(this, "resolve", void 0);

    _defineProperty(this, "reject", void 0);

    _defineProperty(this, "promise", new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    }));
  }

}

exports.Defer = Defer;

const defer = () => new Defer();

exports.defer = defer;