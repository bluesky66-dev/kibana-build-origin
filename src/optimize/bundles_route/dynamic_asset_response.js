"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDynamicAssetResponse = createDynamicAssetResponse;

var _fs = _interopRequireDefault(require("fs"));

var _path = require("path");

var _util = require("util");

var _accept = _interopRequireDefault(require("accept"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _file_hash = require("./file_hash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const asyncOpen = (0, _util.promisify)(_fs.default.open);
const asyncClose = (0, _util.promisify)(_fs.default.close);
const asyncFstat = (0, _util.promisify)(_fs.default.fstat);

async function tryToOpenFile(filePath) {
  try {
    return await asyncOpen(filePath, 'r');
  } catch (e) {
    if (e.code === 'ENOENT') {
      return undefined;
    } else {
      throw e;
    }
  }
}

async function selectCompressedFile(acceptEncodingHeader, path) {
  let fd;
  let fileEncoding;

  const supportedEncodings = _accept.default.encodings(acceptEncodingHeader, ['br', 'gzip']);

  if (supportedEncodings[0] === 'br') {
    fileEncoding = 'br';
    fd = await tryToOpenFile(`${path}.br`);
  }

  if (!fd && supportedEncodings.includes('gzip')) {
    fileEncoding = 'gzip';
    fd = await tryToOpenFile(`${path}.gz`);
  }

  if (!fd) {
    fileEncoding = undefined; // Use raw open to trigger exception if it does not exist

    fd = await asyncOpen(path, 'r');
  }

  return {
    fd,
    fileEncoding
  };
}
/**
 *  Create a Hapi response for the requested path. This is designed
 *  to replicate a subset of the features provided by Hapi's Inert
 *  plugin including:
 *   - ensure path is not traversing out of the bundle directory
 *   - manage use file descriptors for file access to efficiently
 *     interact with the file multiple times in each request
 *   - generate and cache etag for the file
 *   - write correct headers to response for client-side caching
 *     and invalidation
 *   - stream file to response
 *
 *  It differs from Inert in some important ways:
 *   - cached hash/etag is based on the file on disk, but modified
 *     by the public path so that individual public paths have
 *     different etags, but can share a cache
 */


async function createDynamicAssetResponse({
  request,
  h,
  bundlesPath,
  publicPath,
  fileHashCache,
  isDist
}) {
  let fd;
  let fileEncoding;

  try {
    const path = (0, _path.resolve)(bundlesPath, request.params.path); // prevent path traversal, only process paths that resolve within bundlesPath

    if (!path.startsWith(bundlesPath)) {
      throw _boom.default.forbidden(undefined, 'EACCES');
    } // we use and manage a file descriptor mostly because
    // that's what Inert does, and since we are accessing
    // the file 2 or 3 times per request it seems logical


    ({
      fd,
      fileEncoding
    } = await selectCompressedFile(request.headers['accept-encoding'], path));
    const stat = await asyncFstat(fd);
    const hash = isDist ? undefined : await (0, _file_hash.getFileHash)(fileHashCache, path, stat, fd);

    const content = _fs.default.createReadStream(null, {
      fd,
      start: 0,
      autoClose: true
    });

    fd = undefined; // read stream is now responsible for fd

    const response = h.response(content).takeover().code(200).type(request.server.mime.path(path).type);

    if (isDist) {
      response.header('cache-control', `max-age=${365 * DAY}`);
    } else {
      response.etag(`${hash}-${publicPath}`);
      response.header('cache-control', 'must-revalidate');
    } // If we manually selected a compressed file, specify the encoding header.
    // Otherwise, let Hapi automatically gzip the response.


    if (fileEncoding) {
      response.header('content-encoding', fileEncoding);
    }

    return response;
  } catch (error) {
    if (fd) {
      try {
        await asyncClose(fd);
      } catch (_) {// ignore errors from close, we already have one to report
        // and it's very likely they are the same
      }
    }

    if (error.code === 'ENOENT') {
      throw _boom.default.notFound();
    }

    throw _boom.default.boomify(error);
  }
}