"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNDJSONStream = void 0;

var _stream = require("stream");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const delimiter = '\n';

const createNDJSONStream = (results, logger) => {
  const stream = new _stream.PassThrough();
  results.subscribe({
    next: message => {
      try {
        const line = JSON.stringify(message);
        stream.write(`${line}${delimiter}`);
      } catch (error) {
        logger.error('Could not serialize or stream a message.');
        logger.error(error);
      }
    },
    error: error => {
      stream.end();
      logger.error(error);
    },
    complete: () => stream.end()
  });
  return stream;
};

exports.createNDJSONStream = createNDJSONStream;