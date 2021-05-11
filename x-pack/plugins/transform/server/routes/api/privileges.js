"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPrivilegesRoute = registerPrivilegesRoute;

var _constants = require("../../../common/constants");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerPrivilegesRoute({
  router,
  license
}) {
  router.get({
    path: (0, _index.addBasePath)('privileges'),
    validate: {}
  }, license.guardApiRoute(async (ctx, req, res) => {
    const privilegesResult = {
      hasAllPrivileges: true,
      missingPrivileges: {
        cluster: [],
        index: []
      }
    };

    if (license.getStatus().isSecurityEnabled === false) {
      // If security isn't enabled, let the user use app.
      return res.ok({
        body: privilegesResult
      });
    } // Get cluster privileges


    const {
      body: {
        has_all_requested: hasAllPrivileges,
        cluster
      }
    } = await ctx.core.elasticsearch.client.asCurrentUser.security.hasPrivileges({
      method: 'POST',
      body: {
        cluster: _constants.APP_CLUSTER_PRIVILEGES
      }
    }); // Find missing cluster privileges and set overall app privileges

    privilegesResult.missingPrivileges.cluster = extractMissingPrivileges(cluster);
    privilegesResult.hasAllPrivileges = hasAllPrivileges; // Get all index privileges the user has

    const {
      body: {
        indices
      }
    } = await ctx.core.elasticsearch.client.asCurrentUser.security.getUserPrivileges({
      method: 'GET'
    }); // Check if they have all the required index privileges for at least one index

    const oneIndexWithAllPrivileges = indices.find(({
      privileges
    }) => {
      if (privileges.includes('all')) {
        return true;
      }

      const indexHasAllPrivileges = _constants.APP_INDEX_PRIVILEGES.every(privilege => privileges.includes(privilege));

      return indexHasAllPrivileges;
    }); // If they don't, return list of required index privileges

    if (!oneIndexWithAllPrivileges) {
      privilegesResult.missingPrivileges.index = [..._constants.APP_INDEX_PRIVILEGES];
    }

    return res.ok({
      body: privilegesResult
    });
  }));
}

const extractMissingPrivileges = (privilegesObject = {}) => Object.keys(privilegesObject).reduce((privileges, privilegeName) => {
  if (!privilegesObject[privilegeName]) {
    privileges.push(privilegeName);
  }

  return privileges;
}, []);