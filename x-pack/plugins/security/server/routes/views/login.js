"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineLoginRoutes = defineLoginRoutes;

var _configSchema = require("@kbn/config-schema");

var _parse_next = require("../../../common/parse_next");

var _model = require("../../../common/model");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines routes required for the Login view.
 */


function defineLoginRoutes({
  config,
  router,
  logger,
  httpResources,
  basePath,
  license
}) {
  httpResources.register({
    path: '/login',
    validate: {
      query: _configSchema.schema.object({
        [_constants.NEXT_URL_QUERY_STRING_PARAMETER]: _configSchema.schema.maybe(_configSchema.schema.string()),
        [_constants.LOGOUT_REASON_QUERY_STRING_PARAMETER]: _configSchema.schema.maybe(_configSchema.schema.string())
      }, {
        unknowns: 'allow'
      })
    },
    options: {
      authRequired: 'optional'
    }
  }, async (context, request, response) => {
    // Default to true if license isn't available or it can't be resolved for some reason.
    const shouldShowLogin = license.isEnabled() ? license.getFeatures().showLogin : true;
    const isUserAlreadyLoggedIn = request.auth.isAuthenticated;

    if (isUserAlreadyLoggedIn || !shouldShowLogin) {
      var _request$url$href, _request$url;

      logger.debug('User is already authenticated, redirecting...');
      return response.redirected({
        headers: {
          location: (0, _parse_next.parseNext)((_request$url$href = (_request$url = request.url) === null || _request$url === void 0 ? void 0 : _request$url.href) !== null && _request$url$href !== void 0 ? _request$url$href : '', basePath.serverBasePath)
        }
      });
    }

    return response.renderAnonymousCoreApp();
  });
  router.get({
    path: '/internal/security/login_state',
    validate: false,
    options: {
      authRequired: false
    }
  }, async (context, request, response) => {
    const {
      allowLogin,
      layout = 'form'
    } = license.getFeatures();
    const {
      sortedProviders,
      selector
    } = config.authc;
    const providers = sortedProviders.map(({
      type,
      name
    }) => {
      var _config$authc$provide; // Since `config.authc.sortedProviders` is based on `config.authc.providers` config we can
      // be sure that config is present for every provider in `config.authc.sortedProviders`.


      const {
        showInSelector,
        description,
        hint,
        icon
      } = (_config$authc$provide = config.authc.providers[type]) === null || _config$authc$provide === void 0 ? void 0 : _config$authc$provide[name];
      const usesLoginForm = (0, _model.shouldProviderUseLoginForm)(type);
      return {
        type,
        name,
        usesLoginForm,
        showInSelector: showInSelector && (usesLoginForm || selector.enabled),
        description,
        hint,
        icon
      };
    });
    const loginState = {
      allowLogin,
      layout,
      requiresSecureConnection: config.secureCookies,
      loginHelp: config.loginHelp,
      selector: {
        enabled: selector.enabled,
        providers
      }
    };
    return response.ok({
      body: loginState
    });
  });
}