"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizedUserPreRoutingFactory = void 0;

var _get_user = require("./get_user");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const superuserRole = 'superuser';

const authorizedUserPreRoutingFactory = function authorizedUserPreRoutingFn(reporting) {
  const setupDeps = reporting.getPluginSetupDeps();
  const getUser = (0, _get_user.getUserFactory)(setupDeps.security);
  return handler => {
    return (context, req, res) => {
      let user = false;

      if (setupDeps.security && setupDeps.security.license.isEnabled()) {
        // find the authenticated user, or null if security is not enabled
        user = getUser(req);

        if (!user) {
          // security is enabled but the user is null
          return res.unauthorized({
            body: `Sorry, you aren't authenticated`
          });
        }
      }

      if (user) {
        // check allowance with the configured set of roleas + "superuser"
        const config = reporting.getConfig();
        const allowedRoles = config.get('roles', 'allow') || [];
        const authorizedRoles = [superuserRole, ...allowedRoles];

        if (!user.roles.find(role => authorizedRoles.includes(role))) {
          // user's roles do not allow
          return res.forbidden({
            body: `Sorry, you don't have access to Reporting`
          });
        }
      }

      return handler(user, context, req, res);
    };
  };
};

exports.authorizedUserPreRoutingFactory = authorizedUserPreRoutingFactory;