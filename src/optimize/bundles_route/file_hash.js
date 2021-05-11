"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileHash = getFileHash;

var _crypto = require("crypto");

var _fs = _interopRequireDefault(require("fs"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 *  Get the hash of a file via a file descriptor
 */
async function getFileHash(cache, path, stat, fd) {
  const key = `${path}:${stat.ino}:${stat.size}:${stat.mtime.getTime()}`;
  const cached = cache.get(key);

  if (cached) {
    return await cached;
  }

  const hash = (0, _crypto.createHash)('sha1');

  const read = _fs.default.createReadStream(null, {
    fd,
    start: 0,
    autoClose: false
  });

  const promise = Rx.merge(Rx.fromEvent(read, 'data'), Rx.fromEvent(read, 'error').pipe((0, _operators.map)(error => {
    throw error;
  }))).pipe((0, _operators.takeUntil)(Rx.fromEvent(read, 'end'))).forEach(chunk => hash.update(chunk)).then(() => hash.digest('hex')).catch(error => {
    // don't cache failed attempts
    cache.del(key);
    throw error;
  });
  cache.set(key, promise);
  return await promise;
}