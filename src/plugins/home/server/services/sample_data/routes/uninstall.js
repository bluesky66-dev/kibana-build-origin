"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUninstallRoute = createUninstallRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = _interopRequireDefault(require("lodash"));

var _create_index_name = require("../lib/create_index_name");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createUninstallRoute(router, sampleDatasets, usageTracker) {
  router.delete({
    path: '/api/sample_data/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, async ({
    core: {
      elasticsearch: {
        legacy: {
          client: {
            callAsCurrentUser
          }
        }
      },
      savedObjects: {
        getClient: getSavedObjectsClient,
        typeRegistry
      }
    }
  }, request, response) => {
    const sampleDataset = sampleDatasets.find(({
      id
    }) => id === request.params.id);

    if (!sampleDataset) {
      return response.notFound();
    }

    for (let i = 0; i < sampleDataset.dataIndices.length; i++) {
      const dataIndexConfig = sampleDataset.dataIndices[i];
      const index = (0, _create_index_name.createIndexName)(sampleDataset.id, dataIndexConfig.id);

      try {
        await callAsCurrentUser('indices.delete', {
          index
        });
      } catch (err) {
        return response.customError({
          statusCode: err.status,
          body: {
            message: `Unable to delete sample data index "${index}", error: ${err.message}`
          }
        });
      }
    }

    const includedHiddenTypes = sampleDataset.savedObjects.map(object => object.type).filter(supportedType => typeRegistry.isHidden(supportedType));
    const savedObjectsClient = getSavedObjectsClient({
      includedHiddenTypes
    });
    const deletePromises = sampleDataset.savedObjects.map(({
      type,
      id
    }) => savedObjectsClient.delete(type, id));

    try {
      await Promise.all(deletePromises);
    } catch (err) {
      // ignore 404s since users could have deleted some of the saved objects via the UI
      if (_lodash.default.get(err, 'output.statusCode') !== 404) {
        return response.customError({
          statusCode: err.status,
          body: {
            message: `Unable to delete sample dataset saved objects, error: ${err.message}`
          }
        });
      }
    } // track the usage operation in a non-blocking way


    usageTracker.addUninstall(request.params.id);
    return response.noContent();
  });
}