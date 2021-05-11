"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineSAMLRoutes = defineSAMLRoutes;

var _configSchema = require("@kbn/config-schema");

var _authentication = require("../../authentication");

var _providers = require("../../authentication/providers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines routes required for SAML authentication.
 */


function defineSAMLRoutes({
  router,
  logger,
  getAuthenticationService,
  basePath
}) {
  // Generate two identical routes with new and deprecated URL and issue a warning if route with
  // deprecated URL is ever used.
  for (const path of ['/api/security/saml/callback', '/api/security/v1/saml']) {
    router.post({
      path,
      validate: {
        body: _configSchema.schema.object({
          SAMLResponse: _configSchema.schema.string(),
          RelayState: _configSchema.schema.maybe(_configSchema.schema.string())
        }, {
          unknowns: 'ignore'
        })
      },
      options: {
        authRequired: false,
        xsrfRequired: false
      }
    }, async (context, request, response) => {
      if (path === '/api/security/v1/saml') {
        const serverBasePath = basePath.serverBasePath;
        logger.warn(`The "${serverBasePath}${path}" URL is deprecated and will stop working in the next major version, please use "${serverBasePath}/api/security/saml/callback" URL instead.`, {
          tags: ['deprecation']
        });
      }

      try {
        // When authenticating using SAML we _expect_ to redirect to the Kibana target location.
        const authenticationResult = await getAuthenticationService().login(request, {
          provider: {
            type: _providers.SAMLAuthenticationProvider.type
          },
          value: {
            type: _authentication.SAMLLogin.LoginWithSAMLResponse,
            samlResponse: request.body.SAMLResponse,
            relayState: request.body.RelayState
          }
        });

        if (authenticationResult.redirected()) {
          return response.redirected({
            headers: {
              location: authenticationResult.redirectURL
            }
          });
        }

        return response.unauthorized({
          body: authenticationResult.error
        });
      } catch (err) {
        logger.error(err);
        return response.internalError();
      }
    });
  }
}