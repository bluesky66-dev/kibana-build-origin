"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readStreamToCompletion = void 0;

var _stream = require("stream");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readStreamToCompletion = stream => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    (0, _stream.pipeline)(stream, new _stream.Writable({
      objectMode: true,

      write(chunk, enc, done) {
        chunks.push(chunk);
        done();
      }

    }), err => {
      if (err) {
        reject(err);
      } else {
        resolve(chunks);
      }
    });
  });
};

exports.readStreamToCompletion = readStreamToCompletion;