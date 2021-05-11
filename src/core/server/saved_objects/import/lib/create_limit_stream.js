"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLimitStream = createLimitStream;

var _stream = require("stream");

var _errors = require("../errors");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createLimitStream(limit) {
  let counter = 0;
  return new _stream.Transform({
    objectMode: true,

    async transform(obj, enc, done) {
      if (counter >= limit) {
        return done(_errors.SavedObjectsImportError.importSizeExceeded(limit));
      }

      counter++;
      done(undefined, obj);
    }

  });
}