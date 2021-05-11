"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineCommonRoutes = defineCommonRoutes;

var _configSchema = require("@kbn/config-schema");

var _parse_next = require("../../../common/parse_next");

var _authentication = require("../../authentication");

var _errors = require("../../errors");

var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines routes that are common to various authentication mechanisms.
 */


function defineCommonRoutes({
  router,
  getAuthenticationService,
  basePath,
  license,
  logger
}) {
  // Generate two identical routes with new and deprecated URL and issue a warning if route with deprecated URL is ever used.
  for (const path of ['/api/security/logout', '/api/security/v1/logout']) {
    router.get({
      path,
      // Allow unknown query parameters as this endpoint can be hit by the 3rd-party with any
      // set of query string parameters (e.g. SAML/OIDC logout request/response parameters).
      validate: {
        query: _configSchema.schema.object({}, {
          unknowns: 'allow'
        })
      },
      options: {
        authRequired: false
      }
    }, async (context, request, response) => {
      const serverBasePath = basePath.serverBasePath;

      if (path === '/api/security/v1/logout') {
        logger.warn(`The "${serverBasePath}${path}" URL is deprecated and will stop working in the next major version, please use "${serverBasePath}/api/security/logout" URL instead.`, {
          tags: ['deprecation']
        });
      }

      if (!(0, _authentication.canRedirectRequest)(request)) {
        return response.badRequest({
          body: 'Client should be able to process redirect response.'
        });
      }

      try {
        const deauthenticationResult = await getAuthenticationService().logout(request);

        if (deauthenticationResult.failed()) {
          return response.customError((0, _errors.wrapIntoCustomErrorResponse)(deauthenticationResult.error));
        }

        return response.redirected({
          headers: {
            location: deauthenticationResult.redirectURL || `${serverBasePath}/`
          }
        });
      } catch (error) {
        return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
      }
    });
  } // Generate two identical routes with new and deprecated URL and issue a warning if route with deprecated URL is ever used.


  for (const path of ['/internal/security/me', '/api/security/v1/me']) {
    router.get({
      path,
      validate: false
    }, (0, _licensed_route_handler.createLicensedRouteHandler)((context, request, response) => {
      if (path === '/api/security/v1/me') {
        logger.warn(`The "${basePath.serverBasePath}${path}" endpoint is deprecated and will be removed in the next major version.`, {
          tags: ['deprecation']
        });
      }

      return response.ok({
        body: getAuthenticationService().getCurrentUser(request)
      });
    }));
  }

  const basicParamsSchema = _configSchema.schema.object({
    username: _configSchema.schema.string({
      minLength: 1
    }),
    password: _configSchema.schema.string({
      minLength: 1
    })
  });

  function getLoginAttemptForProviderType(providerType, redirectURL, params) {
    if (providerType === _authentication.SAMLAuthenticationProvider.type) {
      return {
        type: _authentication.SAMLLogin.LoginInitiatedByUser,
        redirectURL
      };
    }

    if (providerType === _authentication.OIDCAuthenticationProvider.type) {
      return {
        type: _authentication.OIDCLogin.LoginInitiatedByUser,
        redirectURL
      };
    }

    if (providerType === _authentication.BasicAuthenticationProvider.type || providerType === _authentication.TokenAuthenticationProvider.type) {
      return params;
    }

    return undefined;
  }

  router.post({
    path: '/internal/security/login',
    validate: {
      body: _configSchema.schema.object({
        providerType: _configSchema.schema.string(),
        providerName: _configSchema.schema.string(),
        currentURL: _configSchema.schema.string(),
        params: _configSchema.schema.conditional(_configSchema.schema.siblingRef('providerType'), _configSchema.schema.oneOf([_configSchema.schema.literal(_authentication.BasicAuthenticationProvider.type), _configSchema.schema.literal(_authentication.TokenAuthenticationProvider.type)]), basicParamsSchema, _configSchema.schema.never())
      })
    },
    options: {
      authRequired: false
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    const {
      providerType,
      providerName,
      currentURL,
      params
    } = request.body;
    logger.info(`Logging in with provider "${providerName}" (${providerType})`);
    const redirectURL = (0, _parse_next.parseNext)(currentURL, basePath.serverBasePath);

    try {
      const authenticationResult = await getAuthenticationService().login(request, {
        provider: {
          name: providerName
        },
        redirectURL,
        value: getLoginAttemptForProviderType(providerType, redirectURL, params)
      });

      if (authenticationResult.redirected() || authenticationResult.succeeded()) {
        return response.ok({
          body: {
            location: authenticationResult.redirectURL || redirectURL
          },
          headers: authenticationResult.authResponseHeaders
        });
      }

      return response.unauthorized({
        body: authenticationResult.error,
        headers: authenticationResult.authResponseHeaders
      });
    } catch (err) {
      logger.error(err);
      return response.internalError();
    }
  }));
  router.post({
    path: '/internal/security/access_agreement/acknowledge',
    validate: false
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    // If license doesn't allow access agreement we shouldn't handle request.
    if (!license.getFeatures().allowAccessAgreement) {
      logger.warn(`Attempted to acknowledge access agreement when license doesn't allow it.`);
      return response.forbidden({
        body: {
          message: `Current license doesn't support access agreement.`
        }
      });
    }

    try {
      await getAuthenticationService().acknowledgeAccessAgreement(request);
    } catch (err) {
      logger.error(err);
      return response.internalError();
    }

    return response.noContent();
  }));
}