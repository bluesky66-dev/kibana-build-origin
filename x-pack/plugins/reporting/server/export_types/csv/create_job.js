"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJobFnFactory = void 0;

var _constants = require("../../../common/constants");

var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createJobFnFactory = function createJobFactoryFn(reporting, parentLogger) {
  const logger = parentLogger.clone([_constants.CSV_JOB_TYPE_DEPRECATED, 'create-job']);
  const config = reporting.getConfig();
  const crypto = (0, _lib.cryptoFactory)(config.get('encryptionKey'));
  return async function createJob(jobParams, context, request) {
    const serializedEncryptedHeaders = await crypto.encrypt(request.headers);
    const savedObjectsClient = context.core.savedObjects.client;
    const indexPatternSavedObject = await savedObjectsClient.get('index-pattern', jobParams.indexPatternId);
    return {
      headers: serializedEncryptedHeaders,
      spaceId: reporting.getSpaceId(request, logger),
      indexPatternSavedObject,
      ...jobParams
    };
  };
};

exports.createJobFnFactory = createJobFnFactory;