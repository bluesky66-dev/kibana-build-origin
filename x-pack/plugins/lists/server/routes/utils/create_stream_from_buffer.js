"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStreamFromBuffer = void 0;

var _stream = require("stream");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createStreamFromBuffer = buffer => {
  const stream = new _stream.Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

exports.createStreamFromBuffer = createStreamFromBuffer;