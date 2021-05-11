"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFetchRoute = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../../../common/constants");

var _services = require("../../../services");

var _shared_imports = require("../../../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerFetchRoute = ({
  router,
  license
}) => {
  router.get({
    path: (0, _services.addBasePath)('/snapshot_repositories'),
    validate: false
  }, async (ctx, request, response) => {
    if (!license.isCurrentLicenseAtLeast(_constants.MIN_SEARCHABLE_SNAPSHOT_LICENSE)) {
      return response.forbidden({
        body: _i18n.i18n.translate('xpack.indexLifecycleMgmt.searchSnapshotlicenseCheckErrorMessage', {
          defaultMessage: 'Use of searchable snapshots requires at least an enterprise level license.'
        })
      });
    }

    try {
      const esResult = await ctx.core.elasticsearch.client.asCurrentUser.snapshot.getRepository({
        repository: '*'
      });
      const repos = {
        repositories: Object.keys(esResult.body)
      };
      return response.ok({
        body: repos
      });
    } catch (e) {
      // If ES responds with 404 when looking up all snapshots we return an empty array
      if ((e === null || e === void 0 ? void 0 : e.statusCode) === 404) {
        const repos = {
          repositories: []
        };
        return response.ok({
          body: repos
        });
      }

      return (0, _shared_imports.handleEsError)({
        error: e,
        response
      });
    }
  });
};

exports.registerFetchRoute = registerFetchRoute;