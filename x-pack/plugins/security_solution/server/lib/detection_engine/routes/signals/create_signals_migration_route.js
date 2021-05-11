"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSignalsMigrationRoute = void 0;

var _constants = require("../../../../../common/constants");

var _create_signals_migration_schema = require("../../../../../common/detection_engine/schemas/request/create_signals_migration_schema");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _utils = require("../utils");

var _check_template_version = require("../index/check_template_version");

var _helpers = require("../../migrations/helpers");

var _get_index_aliases = require("../../index/get_index_aliases");

var _bad_request_error = require("../../errors/bad_request_error");

var _migration_service = require("../../migrations/migration_service");

var _get_index_versions_by_index = require("../../migrations/get_index_versions_by_index");

var _get_signal_versions_by_index = require("../../migrations/get_signal_versions_by_index");

var _get_signals_template = require("../index/get_signals_template");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSignalsMigrationRoute = (router, security) => {
  router.post({
    path: _constants.DETECTION_ENGINE_SIGNALS_MIGRATION_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_create_signals_migration_schema.createSignalsMigrationSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const {
      index: indices,
      ...reindexOptions
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
      const currentVersion = await (0, _check_template_version.getTemplateVersion)({
        alias: signalsAlias,
        esClient
      });

      if ((0, _helpers.isOutdated)({
        current: currentVersion,
        target: _get_signals_template.SIGNALS_TEMPLATE_VERSION
      })) {
        throw new _bad_request_error.BadRequestError(`Cannot migrate due to the signals template being out of date. Latest version: [${_get_signals_template.SIGNALS_TEMPLATE_VERSION}], template version: [${currentVersion}]. Please visit Detections to automatically update your template, then try again.`);
      }

      const signalsIndexAliases = await (0, _get_index_aliases.getIndexAliases)({
        esClient,
        alias: signalsAlias
      });
      const nonSignalsIndices = indices.filter(index => !signalsIndexAliases.some(alias => alias.index === index));

      if (nonSignalsIndices.length > 0) {
        throw new _bad_request_error.BadRequestError(`The following indices are not signals indices and cannot be migrated: [${nonSignalsIndices.join()}].`);
      }

      const indexVersionsByIndex = await (0, _get_index_versions_by_index.getIndexVersionsByIndex)({
        esClient,
        index: indices
      });
      const signalVersionsByIndex = await (0, _get_signal_versions_by_index.getSignalVersionsByIndex)({
        esClient,
        index: indices
      });
      const migrationResults = await Promise.all(indices.map(async index => {
        var _indexVersionsByIndex, _signalVersionsByInde;

        const indexVersion = (_indexVersionsByIndex = indexVersionsByIndex[index]) !== null && _indexVersionsByIndex !== void 0 ? _indexVersionsByIndex : 0;
        const signalVersions = (_signalVersionsByInde = signalVersionsByIndex[index]) !== null && _signalVersionsByInde !== void 0 ? _signalVersionsByInde : [];

        if ((0, _helpers.isOutdated)({
          current: indexVersion,
          target: currentVersion
        }) || (0, _helpers.signalsAreOutdated)({
          signalVersions,
          target: currentVersion
        })) {
          try {
            const isWriteIndex = signalsIndexAliases.some(alias => alias.isWriteIndex && alias.index === index);

            if (isWriteIndex) {
              throw new _bad_request_error.BadRequestError('The specified index is a write index and cannot be migrated.');
            }

            const migration = await migrationService.create({
              index,
              reindexOptions,
              version: currentVersion
            });
            return {
              index: migration.attributes.sourceIndex,
              migration_id: migration.id,
              migration_index: migration.attributes.destinationIndex
            };
          } catch (err) {
            const error = (0, _utils.transformError)(err);
            return {
              index,
              error: {
                message: error.message,
                status_code: error.statusCode
              },
              migration_id: null,
              migration_index: null
            };
          }
        } else {
          return {
            index,
            migration_id: null,
            migration_index: null
          };
        }
      }));
      return response.ok({
        body: {
          indices: migrationResults
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

exports.createSignalsMigrationRoute = createSignalsMigrationRoute;