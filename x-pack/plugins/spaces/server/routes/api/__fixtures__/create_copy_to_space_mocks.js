"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResolveSavedObjectsImportErrorsMock = exports.createImportSavedObjectsFromStreamMock = exports.createExportSavedObjectsToStreamMock = void 0;

var _stream = require("stream");

var _utils = require("@kbn/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function readStreamToCompletion(stream) {
  return await (0, _utils.createPromiseFromStreams)([stream, (0, _utils.createConcatStream)([])]);
}

const createExportSavedObjectsToStreamMock = () => {
  return jest.fn().mockResolvedValue(new _stream.Readable({
    objectMode: true,

    read() {
      this.push(null);
    }

  }));
};

exports.createExportSavedObjectsToStreamMock = createExportSavedObjectsToStreamMock;

const createImportSavedObjectsFromStreamMock = () => {
  return jest.fn().mockImplementation(async opts => {
    const objectsToImport = await readStreamToCompletion(opts.readStream);
    return {
      success: true,
      successCount: objectsToImport.length
    };
  });
};

exports.createImportSavedObjectsFromStreamMock = createImportSavedObjectsFromStreamMock;

const createResolveSavedObjectsImportErrorsMock = () => {
  return jest.fn().mockImplementation(async opts => {
    const objectsToImport = await readStreamToCompletion(opts.readStream);
    return {
      success: true,
      successCount: objectsToImport.length
    };
  });
};

exports.createResolveSavedObjectsImportErrorsMock = createResolveSavedObjectsImportErrorsMock;