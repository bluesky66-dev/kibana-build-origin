"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignalsMigrationStatusRoute = void 0;

var _constants = require("../../../../../common/constants");

var _get_signals_migration_status_schema = require("../../../../../common/detection_engine/schemas/request/get_signals_migration_status_schema");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _get_index_aliases = require("../../index/get_index_aliases");

var _get_index_versions_by_index = require("../../migrations/get_index_versions_by_index");

var _get_migration_saved_objects_by_index = require("../../migrations/get_migration_saved_objects_by_index");

var _get_signals_indices_in_range = require("../../migrations/get_signals_indices_in_range");

var _get_signal_versions_by_index = require("../../migrations/get_signal_versions_by_index");

var _helpers = require("../../migrations/helpers");

var _check_template_version = require("../index/check_template_version");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getSignalsMigrationStatusRoute = router => {
  router.get({
    path: _constants.DETECTION_ENGINE_SIGNALS_MIGRATION_STATUS_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_get_signals_migration_status_schema.getSignalsMigrationStatusSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const esClient = context.core.elasticsearch.client.asCurrentUser;
    const soClient = context.core.savedObjects.client;

    try {
      var _context$securitySolu;

      const appClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

      if (!appClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const {
        from
      } = request.query;
      const signalsAlias = appClient.getSignalsIndex();
      const currentVersion = await (0, _check_template_version.getTemplateVersion)({
        alias: signalsAlias,
        esClient
      });
      const indexAliases = await (0, _get_index_aliases.getIndexAliases)({
        alias: signalsAlias,
        esClient
      });
      const signalsIndices = indexAliases.map(indexAlias => indexAlias.index);
      const indicesInRange = await (0, _get_signals_indices_in_range.getSignalsIndicesInRange)({
        esClient,
        index: signalsIndices,
        from
      });
      const migrationsByIndex = await (0, _get_migration_saved_objects_by_index.getMigrationSavedObjectsByIndex)({
        index: indicesInRange,
        soClient
      });
      const indexVersionsByIndex = await (0, _get_index_versions_by_index.getIndexVersionsByIndex)({
        esClient,
        index: indicesInRange
      });
      const signalVersionsByIndex = await (0, _get_signal_versions_by_index.getSignalVersionsByIndex)({
        esClient,
        index: indicesInRange
      });
      const indexStatuses = indicesInRange.map(index => {
        var _indexVersionsByIndex, _signalVersionsByInde, _migrationsByIndex$in;

        const version = (_indexVersionsByIndex = indexVersionsByIndex[index]) !== null && _indexVersionsByIndex !== void 0 ? _indexVersionsByIndex : 0;
        const signalVersions = (_signalVersionsByInde = signalVersionsByIndex[index]) !== null && _signalVersionsByInde !== void 0 ? _signalVersionsByInde : [];
        const migrations = (_migrationsByIndex$in = migrationsByIndex[index]) !== null && _migrationsByIndex$in !== void 0 ? _migrationsByIndex$in : [];
        return {
          index,
          version,
          signal_versions: signalVersions,
          migrations: migrations.map(m => ({
            id: m.id,
            status: m.attributes.status,
            version: m.attributes.version,
            updated: m.attributes.updated
          })),
          is_outdated: (0, _helpers.isOutdated)({
            current: version,
            target: currentVersion
          }) || (0, _helpers.signalsAreOutdated)({
            signalVersions,
            target: currentVersion
          })
        };
      });
      return response.ok({
        body: {
          indices: indexStatuses
        }
      });
    } catch (err) {
      const error = (0, _utils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.getSignalsMigrationStatusRoute = getSignalsMigrationStatusRoute;