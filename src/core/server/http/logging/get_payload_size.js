"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResponsePayloadBytes = getResponsePayloadBytes;

var _lodash = require("lodash");

var _fs = require("fs");

var _boom = require("@hapi/boom");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isBuffer = (src, variety) => variety === 'buffer' && Buffer.isBuffer(src);

const isFsReadStream = (src, variety) => {
  return variety === 'stream' && src instanceof _fs.ReadStream;
};

const isZlibStream = (src, variety) => {
  return variety === 'stream' && typeof src === 'object' && src !== null && 'bytesWritten' in src;
};

const isString = (src, variety) => variety === 'plain' && typeof src === 'string';
/**
 * Attempts to determine the size (in bytes) of a Hapi response
 * body based on the payload type. Falls back to `undefined`
 * if the size cannot be determined from the response object.
 *
 * @param response Hapi response object or Boom error
 *
 * @internal
 */


function getResponsePayloadBytes(response, log) {
  try {
    const headers = (0, _boom.isBoom)(response) ? response.output.headers : response.headers;
    const contentLength = headers && headers['content-length'];

    if (contentLength) {
      const val = parseInt( // hapi response headers can be `string | string[]`, so we need to handle both cases
      Array.isArray(contentLength) ? String(contentLength) : contentLength, 10);
      return !isNaN(val) ? val : undefined;
    }

    if ((0, _boom.isBoom)(response)) {
      return Buffer.byteLength(JSON.stringify(response.output.payload));
    }

    if (isBuffer(response.source, response.variety)) {
      return response.source.byteLength;
    }

    if (isFsReadStream(response.source, response.variety)) {
      return response.source.bytesRead;
    }

    if (isZlibStream(response.source, response.variety)) {
      return response.source.bytesWritten;
    }

    if (isString(response.source, response.variety)) {
      return Buffer.byteLength(response.source);
    }

    if (response.variety === 'plain' && ((0, _lodash.isPlainObject)(response.source) || Array.isArray(response.source))) {
      return Buffer.byteLength(JSON.stringify(response.source));
    }
  } catch (e) {
    // We intentionally swallow any errors as this information is
    // only a nicety for logging purposes, and should not cause the
    // server to crash if it cannot be determined.
    log.warn('Failed to calculate response payload bytes.', e);
  }

  return undefined;
}