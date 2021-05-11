"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInstallRoute = createInstallRoute;

var _configSchema = require("@kbn/config-schema");

var _create_index_name = require("../lib/create_index_name");

var _translate_timestamp = require("../lib/translate_timestamp");

var _load_data = require("../lib/load_data");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const insertDataIntoIndex = (dataIndexConfig, index, nowReference, context, logger) => {
  function updateTimestamps(doc) {
    dataIndexConfig.timeFields.filter(timeFieldName => doc[timeFieldName]).forEach(timeFieldName => {
      doc[timeFieldName] = dataIndexConfig.preserveDayOfWeekTimeOfDay ? (0, _translate_timestamp.translateTimeRelativeToWeek)(doc[timeFieldName], dataIndexConfig.currentTimeMarker, nowReference) : (0, _translate_timestamp.translateTimeRelativeToDifference)(doc[timeFieldName], dataIndexConfig.currentTimeMarker, nowReference);
    });
    return doc;
  }

  const bulkInsert = async docs => {
    const insertCmd = {
      index: {
        _index: index
      }
    };
    const bulk = [];
    docs.forEach(doc => {
      bulk.push(insertCmd);
      bulk.push(updateTimestamps(doc));
    });
    const resp = await context.core.elasticsearch.legacy.client.callAsCurrentUser('bulk', {
      body: bulk
    });

    if (resp.errors) {
      const errMsg = `sample_data install errors while bulk inserting. Elasticsearch response: ${JSON.stringify(resp, null, '')}`;
      logger.warn(errMsg);
      return Promise.reject(new Error(`Unable to load sample data into index "${index}", see kibana logs for details`));
    }
  };

  return (0, _load_data.loadData)(dataIndexConfig.dataPath, bulkInsert); // this returns a Promise
};

function createInstallRoute(router, sampleDatasets, logger, usageTracker) {
  router.post({
    path: '/api/sample_data/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      // TODO validate now as date
      query: _configSchema.schema.object({
        now: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, req, res) => {
    const {
      params,
      query
    } = req;
    const sampleDataset = sampleDatasets.find(({
      id
    }) => id === params.id);

    if (!sampleDataset) {
      return res.notFound();
    } //  @ts-ignore Custom query validation used


    const now = query.now ? new Date(query.now) : new Date();
    const nowReference = (0, _translate_timestamp.dateToIso8601IgnoringTime)(now);
    const counts = {};

    for (let i = 0; i < sampleDataset.dataIndices.length; i++) {
      const dataIndexConfig = sampleDataset.dataIndices[i];
      const index = (0, _create_index_name.createIndexName)(sampleDataset.id, dataIndexConfig.id); // clean up any old installation of dataset

      try {
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('indices.delete', {
          index
        });
      } catch (err) {// ignore delete errors
      }

      try {
        const createIndexParams = {
          index,
          body: {
            settings: {
              index: {
                number_of_shards: 1,
                auto_expand_replicas: '0-1'
              }
            },
            mappings: {
              properties: dataIndexConfig.fields
            }
          }
        };
        await context.core.elasticsearch.legacy.client.callAsCurrentUser('indices.create', createIndexParams);
      } catch (err) {
        const errMsg = `Unable to create sample data index "${index}", error: ${err.message}`;
        logger.warn(errMsg);
        return res.customError({
          body: errMsg,
          statusCode: err.status
        });
      }

      try {
        const count = await insertDataIntoIndex(dataIndexConfig, index, nowReference, context, logger);
        counts[index] = count;
      } catch (err) {
        const errMsg = `sample_data install errors while loading data. Error: ${err}`;
        logger.warn(errMsg);
        return res.internalError({
          body: errMsg
        });
      }
    }

    let createResults;

    try {
      const {
        getClient,
        typeRegistry
      } = context.core.savedObjects;
      const includedHiddenTypes = sampleDataset.savedObjects.map(object => object.type).filter(supportedType => typeRegistry.isHidden(supportedType));
      const client = getClient({
        includedHiddenTypes
      });
      createResults = await client.bulkCreate(sampleDataset.savedObjects.map(({
        version,
        ...savedObject
      }) => savedObject), {
        overwrite: true
      });
    } catch (err) {
      const errMsg = `bulkCreate failed, error: ${err.message}`;
      logger.warn(errMsg);
      return res.internalError({
        body: errMsg
      });
    }

    const errors = createResults.saved_objects.filter(savedObjectCreateResult => {
      return Boolean(savedObjectCreateResult.error);
    });

    if (errors.length > 0) {
      const errMsg = `sample_data install errors while loading saved objects. Errors: ${JSON.stringify(errors)}`;
      logger.warn(errMsg);
      return res.customError({
        body: errMsg,
        statusCode: 403
      });
    }

    usageTracker.addInstall(params.id); // FINALLY

    return res.ok({
      body: {
        elasticsearchIndicesCreated: counts,
        kibanaSavedObjectsLoaded: sampleDataset.savedObjects.length
      }
    });
  });
}