"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bufferToStream = bufferToStream;
exports.streamToString = streamToString;
exports.streamToBuffer = streamToBuffer;

var _stream = require("stream");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function bufferToStream(buffer) {
  const stream = new _stream.PassThrough();
  stream.end(buffer);
  return stream;
}

function streamToString(stream) {
  if (stream instanceof Buffer) return Promise.resolve(stream.toString());
  return new Promise((resolve, reject) => {
    const body = [];
    stream.on('data', chunk => body.push(chunk));
    stream.on('end', () => resolve(body.join('')));
    stream.on('error', reject);
  });
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}