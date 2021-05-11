"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJobFnFactory = void 0;

var _constants = require("../../../../common/constants");

var _lib = require("../../../lib");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createJobFnFactory = function createJobFactoryFn(reporting, parentLogger) {
  const logger = parentLogger.clone([_constants.PNG_JOB_TYPE, 'execute-job']);
  const config = reporting.getConfig();
  const crypto = (0, _lib.cryptoFactory)(config.get('encryptionKey'));
  return async function createJob({
    objectType,
    title,
    relativeUrl,
    browserTimezone,
    layout
  }, context, req) {
    const serializedEncryptedHeaders = await crypto.encrypt(req.headers);
    (0, _common.validateUrls)([relativeUrl]);
    return {
      headers: serializedEncryptedHeaders,
      spaceId: reporting.getSpaceId(req, logger),
      objectType,
      title,
      relativeUrl,
      browserTimezone,
      layout,
      forceNow: new Date().toISOString()
    };
  };
};

exports.createJobFnFactory = createJobFnFactory;