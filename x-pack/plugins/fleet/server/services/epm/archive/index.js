"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  unpackBufferToCache: true,
  unpackBufferEntries: true,
  deletePackageCache: true,
  getPathParts: true,
  getAsset: true,
  getBufferExtractor: true,
  untarBuffer: true,
  unzipBuffer: true,
  parseAndVerifyArchiveEntries: true
};
exports.unpackBufferToCache = unpackBufferToCache;
exports.unpackBufferEntries = unpackBufferEntries;
exports.getPathParts = getPathParts;
exports.getAsset = getAsset;
Object.defineProperty(exports, "getBufferExtractor", {
  enumerable: true,
  get: function () {
    return _extract.getBufferExtractor;
  }
});
Object.defineProperty(exports, "untarBuffer", {
  enumerable: true,
  get: function () {
    return _extract.untarBuffer;
  }
});
Object.defineProperty(exports, "unzipBuffer", {
  enumerable: true,
  get: function () {
    return _extract.unzipBuffer;
  }
});
Object.defineProperty(exports, "parseAndVerifyArchiveEntries", {
  enumerable: true,
  get: function () {
    return _validation.parseAndVerifyArchiveBuffer;
  }
});
exports.deletePackageCache = void 0;

var _errors = require("../../../errors");

var _cache = require("./cache");

Object.keys(_cache).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _cache[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cache[key];
    }
  });
});

var _extract = require("./extract");

var _validation = require("./validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function unpackBufferToCache({
  name,
  version,
  contentType,
  archiveBuffer,
  installSource
}) {
  const entries = await unpackBufferEntries(archiveBuffer, contentType);
  const paths = [];
  entries.forEach(entry => {
    const {
      path,
      buffer
    } = entry;

    if (buffer) {
      (0, _cache.setArchiveEntry)(path, buffer);
      paths.push(path);
    }
  });
  (0, _cache.setArchiveFilelist)({
    name,
    version
  }, paths);
  return paths;
}

async function unpackBufferEntries(archiveBuffer, contentType) {
  const bufferExtractor = (0, _extract.getBufferExtractor)({
    contentType
  });

  if (!bufferExtractor) {
    throw new _errors.PackageUnsupportedMediaTypeError(`Unsupported media type ${contentType}. Please use 'application/gzip' or 'application/zip'`);
  }

  const entries = [];

  try {
    const onlyFiles = ({
      path
    }) => !path.endsWith('/');

    const addToEntries = entry => entries.push(entry);

    await bufferExtractor(archiveBuffer, onlyFiles, addToEntries);
  } catch (error) {
    throw new _errors.PackageInvalidArchiveError(`Error during extraction of package: ${error}. Assumed content type was ${contentType}, check if this matches the archive type.`);
  } // While unpacking a tar.gz file with unzipBuffer() will result in a thrown error in the try-catch above,
  // unpacking a zip file with untarBuffer() just results in nothing.


  if (entries.length === 0) {
    throw new _errors.PackageInvalidArchiveError(`Archive seems empty. Assumed content type was ${contentType}, check if this matches the archive type.`);
  }

  return entries;
}

const deletePackageCache = ({
  name,
  version
}) => {
  // get cached archive filelist
  const paths = (0, _cache.getArchiveFilelist)({
    name,
    version
  }); // delete cached archive filelist

  (0, _cache.deleteArchiveFilelist)({
    name,
    version
  }); // delete cached archive files
  // this has been populated in unpackBufferToCache()

  paths === null || paths === void 0 ? void 0 : paths.forEach(_cache.deleteArchiveEntry);
  (0, _cache.deletePackageInfo)({
    name,
    version
  });
};

exports.deletePackageCache = deletePackageCache;

function getPathParts(path) {
  let dataset;
  let [pkgkey, service, type, file] = path.split('/'); // if it's a data stream

  if (service === 'data_stream') {
    // save the dataset name
    dataset = type; // drop the `data_stream/dataset-name` portion & re-parse

    [pkgkey, service, type, file] = path.replace(`data_stream/${dataset}/`, '').split('/');
  } // This is to cover for the fields.yml files inside the "fields" directory


  if (file === undefined) {
    file = type;
    type = 'fields';
    service = '';
  }

  return {
    pkgkey,
    service,
    type,
    file,
    dataset,
    path
  };
}

function getAsset(key) {
  const buffer = (0, _cache.getArchiveEntry)(key);
  if (buffer === undefined) throw new Error(`Cannot find asset ${key}`);
  return buffer;
}