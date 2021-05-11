"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.healthRoute = healthRoute;

var _license_api_access = require("../lib/license_api_access");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function healthRoute(router, licenseState, encryptedSavedObjects) {
  router.get({
    path: '/api/alerts/_health',
    validate: false
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);

    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }

    try {
      const {
        security: {
          enabled: isSecurityEnabled = false,
          ssl: {
            http: {
              enabled: isTLSEnabled = false
            } = {}
          } = {}
        } = {}
      } = await context.core.elasticsearch.legacy.client // `transport.request` is potentially unsafe when combined with untrusted user input.
      // Do not augment with such input.
      .callAsInternalUser('transport.request', {
        method: 'GET',
        path: '/_xpack/usage'
      });
      const alertingFrameworkHeath = await context.alerting.getFrameworkHealth();
      const frameworkHealth = {
        isSufficientlySecure: !isSecurityEnabled || isSecurityEnabled && isTLSEnabled,
        hasPermanentEncryptionKey: encryptedSavedObjects.canEncrypt,
        alertingFrameworkHeath
      };
      return res.ok({
        body: frameworkHealth
      });
    } catch (error) {
      return res.badRequest({
        body: error
      });
    }
  }));
}