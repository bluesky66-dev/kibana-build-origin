"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineAccessAgreementRoutes = defineAccessAgreementRoutes;

var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines routes required for the Access Agreement view.
 */


function defineAccessAgreementRoutes({
  getSession,
  httpResources,
  license,
  config,
  router,
  logger
}) {
  // If license doesn't allow access agreement we shouldn't handle request.
  const canHandleRequest = () => license.getFeatures().allowAccessAgreement;

  httpResources.register({
    path: '/security/access_agreement',
    validate: false
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => canHandleRequest() ? response.renderCoreApp() : response.forbidden({
    body: {
      message: `Current license doesn't support access agreement.`
    }
  })));
  router.get({
    path: '/internal/security/access_agreement/state',
    validate: false
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    if (!canHandleRequest()) {
      return response.forbidden({
        body: {
          message: `Current license doesn't support access agreement.`
        }
      });
    } // It's not guaranteed that we'll have session for the authenticated user (e.g. when user is
    // authenticated with the help of HTTP authentication), that means we should safely check if
    // we have it and can get a corresponding configuration.


    try {
      var _config$authc$provide, _config$authc$provide2, _config$authc$provide3;

      const sessionValue = await getSession().get(request);
      const accessAgreement = sessionValue && ((_config$authc$provide = config.authc.providers[sessionValue.provider.type]) === null || _config$authc$provide === void 0 ? void 0 : (_config$authc$provide2 = _config$authc$provide[sessionValue.provider.name]) === null || _config$authc$provide2 === void 0 ? void 0 : (_config$authc$provide3 = _config$authc$provide2.accessAgreement) === null || _config$authc$provide3 === void 0 ? void 0 : _config$authc$provide3.message) || '';
      return response.ok({
        body: {
          accessAgreement
        }
      });
    } catch (err) {
      logger.error(err);
      return response.internalError();
    }
  }));
}