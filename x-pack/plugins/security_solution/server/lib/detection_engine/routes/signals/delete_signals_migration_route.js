"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteSignalsMigrationRoute = void 0;

var _constants = require("../../../../../common/constants");

var _delete_signals_migration_schema = require("../../../../../common/detection_engine/schemas/request/delete_signals_migration_schema");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _utils = require("../utils");

var _migration_service = require("../../migrations/migration_service");

var _get_migration_saved_objects_by_id = require("../../migrations/get_migration_saved_objects_by_id");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteSignalsMigrationRoute = (router, security) => {
  router.delete({
    path: _constants.DETECTION_ENGINE_SIGNALS_MIGRATION_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_delete_signals_migration_schema.deleteSignalsMigrationSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const {
      migration_ids: migrationIds
    } = request.body;

    try {
      var _context$securitySolu, _user$username;

      const esClient = context.core.elasticsearch.client.asCurrentUser;
      const soClient = context.core.savedObjects.client;
      const appClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

      if (!appClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const user = await (security === null || security === void 0 ? void 0 : security.authc.getCurrentUser(request));
      const migrationService = (0, _migration_service.signalsMigrationService)({
        esClient,
        soClient,
        username: (_user$username = user === null || user === void 0 ? void 0 : user.username) !== null && _user$username !== void 0 ? _user$username : 'elastic'
      });
      const signalsAlias = appClient.getSignalsIndex();
      const migrations = await (0, _get_migration_saved_objects_by_id.getMigrationSavedObjectsById)({
        ids: migrationIds,
        soClient
      });
      const deletionResults = await Promise.all(migrations.map(async migration => {
        try {
          const deletedMigration = await migrationService.delete({
            migration,
            signalsAlias
          });
          return {
            id: deletedMigration.id,
            destinationIndex: deletedMigration.attributes.destinationIndex,
            status: deletedMigration.attributes.status,
            sourceIndex: deletedMigration.attributes.sourceIndex,
            version: deletedMigration.attributes.version,
            updated: deletedMigration.attributes.updated
          };
        } catch (err) {
          const error = (0, _utils.transformError)(err);
          return {
            id: migration.id,
            destinationIndex: migration.attributes.destinationIndex,
            error: {
              message: error.message,
              status_code: error.statusCode
            },
            status: migration.attributes.status,
            sourceIndex: migration.attributes.sourceIndex,
            version: migration.attributes.version,
            updated: migration.attributes.updated
          };
        }
      }));
      return response.ok({
        body: {
          migrations: deletionResults
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

exports.deleteSignalsMigrationRoute = deleteSignalsMigrationRoute;