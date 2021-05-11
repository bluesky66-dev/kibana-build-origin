"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupAppStateRoute = void 0;

var _rxjs = require("rxjs");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const setupAppStateRoute = ({
  router,
  log,
  config$,
  displayModifier$,
  doesClusterHaveUserData,
  getAnonymousAccessService
}) => {
  let showInsecureClusterWarning = false;
  (0, _rxjs.combineLatest)([config$, displayModifier$]).subscribe(([config, displayModifier]) => {
    showInsecureClusterWarning = config.showInsecureClusterWarning && displayModifier;
  });
  router.get({
    path: '/internal/security_oss/app_state',
    validate: false
  }, async (context, request, response) => {
    var _anonymousAccessServi;

    let displayAlert = false;

    if (showInsecureClusterWarning) {
      displayAlert = await doesClusterHaveUserData(context.core.elasticsearch.client.asInternalUser, log);
    }

    const anonymousAccessService = getAnonymousAccessService();
    const appState = {
      insecureClusterAlert: {
        displayAlert
      },
      anonymousAccess: {
        isEnabled: (_anonymousAccessServi = anonymousAccessService === null || anonymousAccessService === void 0 ? void 0 : anonymousAccessService.isAnonymousAccessEnabled) !== null && _anonymousAccessServi !== void 0 ? _anonymousAccessServi : false,
        accessURLParameters: anonymousAccessService !== null && anonymousAccessService !== void 0 && anonymousAccessService.accessURLParameters ? Object.fromEntries(anonymousAccessService.accessURLParameters.entries()) : null
      }
    };
    return response.ok({
      body: appState
    });
  });
};

exports.setupAppStateRoute = setupAppStateRoute;