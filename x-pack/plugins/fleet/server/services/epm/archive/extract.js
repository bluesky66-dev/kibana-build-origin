"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.untarBuffer = untarBuffer;
exports.unzipBuffer = unzipBuffer;
exports.getBufferExtractor = getBufferExtractor;

var _tar = _interopRequireDefault(require("tar"));

var _yauzl = _interopRequireDefault(require("yauzl"));

var _streams = require("../streams");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function untarBuffer(buffer, filter = entry => true, onEntry = entry => {}) {
  const deflatedStream = (0, _streams.bufferToStream)(buffer); // use tar.list vs .extract to avoid writing to disk

  const inflateStream = _tar.default.list().on('entry', entry => {
    const path = entry.header.path || '';
    if (!filter({
      path
    })) return;
    (0, _streams.streamToBuffer)(entry).then(entryBuffer => onEntry({
      buffer: entryBuffer,
      path
    }));
  });

  return new Promise((resolve, reject) => {
    inflateStream.on('end', resolve).on('error', reject);
    deflatedStream.pipe(inflateStream);
  });
}

async function unzipBuffer(buffer, filter = entry => true, onEntry = entry => {}) {
  const zipfile = await yauzlFromBuffer(buffer, {
    lazyEntries: true
  });
  zipfile.readEntry();
  zipfile.on('entry', async entry => {
    const path = entry.fileName;
    if (!filter({
      path
    })) return zipfile.readEntry();
    const entryBuffer = await getZipReadStream(zipfile, entry).then(_streams.streamToBuffer);
    onEntry({
      buffer: entryBuffer,
      path
    });
    zipfile.readEntry();
  });
  return new Promise((resolve, reject) => zipfile.on('end', resolve).on('error', reject));
}

function getBufferExtractor(args) {
  if ('contentType' in args) {
    if (args.contentType === 'application/gzip') {
      return untarBuffer;
    } else if (args.contentType === 'application/zip') {
      return unzipBuffer;
    }
  } else if ('archivePath' in args) {
    if (args.archivePath.endsWith('.zip')) {
      return unzipBuffer;
    }

    if (args.archivePath.endsWith('.gz')) {
      return untarBuffer;
    }
  }
}

function yauzlFromBuffer(buffer, opts) {
  return new Promise((resolve, reject) => _yauzl.default.fromBuffer(buffer, opts, (err, handle) => err ? reject(err) : resolve(handle)));
}

function getZipReadStream(zipfile, entry) {
  return new Promise((resolve, reject) => zipfile.openReadStream(entry, (err, readStream) => err ? reject(err) : resolve(readStream)));
}