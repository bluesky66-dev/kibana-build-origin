"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPrivilegesRoute = void 0;

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const extractMissingPrivileges = (privilegesObject = {}) => Object.keys(privilegesObject).reduce((privileges, privilegeName) => {
  if (!privilegesObject[privilegeName]) {
    privileges.push(privilegeName);
  }

  return privileges;
}, []);

const registerPrivilegesRoute = ({
  license,
  router,
  config
}) => {
  router.get({
    path: `${_constants.API_BASE_PATH}/privileges`,
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const privilegesResult = {
      hasAllPrivileges: true,
      missingPrivileges: {
        cluster: []
      }
    }; // Skip the privileges check if security is not enabled

    if (!config.isSecurityEnabled()) {
      return res.ok({
        body: privilegesResult
      });
    }

    const {
      core: {
        elasticsearch: {
          legacy: {
            client
          }
        }
      }
    } = ctx;

    try {
      const {
        has_all_requested: hasAllPrivileges,
        cluster
      } = await client.callAsCurrentUser('transport.request', {
        path: '/_security/user/_has_privileges',
        method: 'POST',
        body: {
          cluster: _constants.APP_CLUSTER_REQUIRED_PRIVILEGES
        }
      });

      if (!hasAllPrivileges) {
        privilegesResult.missingPrivileges.cluster = extractMissingPrivileges(cluster);
      }

      privilegesResult.hasAllPrivileges = hasAllPrivileges;
      return res.ok({
        body: privilegesResult
      });
    } catch (e) {
      return res.internalError({
        body: e
      });
    }
  }));
};

exports.registerPrivilegesRoute = registerPrivilegesRoute;