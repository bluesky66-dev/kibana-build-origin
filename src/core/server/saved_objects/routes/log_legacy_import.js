"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLogLegacyImportRoute = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerLogLegacyImportRoute = (router, logger) => {
  router.post({
    path: '/_log_legacy_import',
    validate: false
  }, async (context, req, res) => {
    logger.warn('Importing saved objects from a .json file has been deprecated');
    return res.ok({
      body: {
        success: true
      }
    });
  });
};

exports.registerLogLegacyImportRoute = registerLogLegacyImportRoute;