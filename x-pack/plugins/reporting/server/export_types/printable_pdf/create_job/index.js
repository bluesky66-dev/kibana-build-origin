"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJobFnFactory = void 0;

var _constants = require("../../../../common/constants");

var _lib = require("../../../lib");

var _common = require("../../common");

var _compatibility_shim = require("./compatibility_shim");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore no module def (deprecated module)


const createJobFnFactory = function createJobFactoryFn(reporting, parentLogger) {
  const config = reporting.getConfig();
  const crypto = (0, _lib.cryptoFactory)(config.get('encryptionKey'));
  const logger = parentLogger.clone([_constants.PDF_JOB_TYPE, 'create-job']);
  const compatibilityShim = (0, _compatibility_shim.compatibilityShimFactory)(logger); // 7.x and below only

  return compatibilityShim(async function createJobFn({
    title,
    relativeUrls,
    browserTimezone,
    layout,
    objectType
  }, context, req) {
    const serializedEncryptedHeaders = await crypto.encrypt(req.headers);
    (0, _common.validateUrls)(relativeUrls);
    return {
      headers: serializedEncryptedHeaders,
      spaceId: reporting.getSpaceId(req, logger),
      browserTimezone,
      forceNow: new Date().toISOString(),
      layout,
      objects: relativeUrls.map(u => ({
        relativeUrl: u
      })),
      // 7.x only: `objects` in the payload
      title,
      objectType
    };
  });
};

exports.createJobFnFactory = createJobFnFactory;