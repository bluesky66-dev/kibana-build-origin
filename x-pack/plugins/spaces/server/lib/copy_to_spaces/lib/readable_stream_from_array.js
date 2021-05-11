"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReadableStreamFromArray = void 0;

var _stream = require("stream");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: Remove in favor of Readable.from once we upgrade to Node 12.x


const createReadableStreamFromArray = array => {
  return new _stream.Readable({
    objectMode: true,

    read() {
      array.forEach(entry => this.push(entry));
      this.push(null);
    }

  });
};

exports.createReadableStreamFromArray = createReadableStreamFromArray;