"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enforceSuperUser = enforceSuperUser;
exports.makeRouterEnforcingSuperuser = makeRouterEnforcingSuperuser;

var _services = require("../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function enforceSuperUser(handler) {
  return function enforceSuperHandler(context, req, res) {
    const security = _services.appContextService.getSecurity();

    const user = security.authc.getCurrentUser(req);

    if (!user) {
      return res.forbidden({
        body: {
          message: 'Access to Fleet API require the superuser role, and for stack security features to be enabled.'
        }
      });
    }

    const userRoles = user.roles || [];

    if (!userRoles.includes('superuser')) {
      return res.forbidden({
        body: {
          message: 'Access to Fleet API require the superuser role.'
        }
      });
    }

    return handler(context, req, res);
  };
}

function makeRouterEnforcingSuperuser(router) {
  return {
    get: (options, handler) => router.get(options, enforceSuperUser(handler)),
    delete: (options, handler) => router.delete(options, enforceSuperUser(handler)),
    post: (options, handler) => router.post(options, enforceSuperUser(handler)),
    put: (options, handler) => router.put(options, enforceSuperUser(handler)),
    patch: (options, handler) => router.patch(options, enforceSuperUser(handler)),
    handleLegacyErrors: handler => router.handleLegacyErrors(handler),
    getRoutes: () => router.getRoutes(),
    routerPath: router.routerPath
  };
}