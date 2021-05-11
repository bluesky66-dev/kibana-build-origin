"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApmTelemetry = createApmTelemetry;

var _operators = require("rxjs/operators");

var _server = require("../../../../../../src/core/server");

var _server2 = require("../../../../observability/server");

var _apm_saved_object_constants = require("../../../common/apm_saved_object_constants");

var _get_internal_saved_objects_client = require("../helpers/get_internal_saved_objects_client");

var _get_apm_indices = require("../settings/apm_indices/get_apm_indices");

var _collect_data_telemetry = require("./collect_data_telemetry");

var _schema = require("./schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const APM_TELEMETRY_TASK_NAME = 'apm-telemetry-task';

async function createApmTelemetry({
  core,
  config$,
  usageCollector,
  taskManager,
  logger,
  kibanaVersion
}) {
  taskManager.registerTaskDefinitions({
    [APM_TELEMETRY_TASK_NAME]: {
      title: 'Collect APM usage',
      createTaskRunner: () => {
        return {
          run: async () => {
            await collectAndStore();
          },
          cancel: async () => {}
        };
      }
    }
  });
  const savedObjectsClient = await (0, _get_internal_saved_objects_client.getInternalSavedObjectsClient)(core);

  const collectAndStore = async () => {
    const config = await config$.pipe((0, _operators.take)(1)).toPromise();
    const [{
      elasticsearch
    }] = await core.getStartServices();
    const esClient = elasticsearch.client;
    const indices = await (0, _get_apm_indices.getApmIndices)({
      config,
      savedObjectsClient
    });

    const search = params => (0, _server2.unwrapEsResponse)(esClient.asInternalUser.search(params));

    const indicesStats = params => (0, _server2.unwrapEsResponse)(esClient.asInternalUser.indices.stats(params));

    const transportRequest = params => (0, _server2.unwrapEsResponse)(esClient.asInternalUser.transport.request(params));

    const dataTelemetry = await (0, _collect_data_telemetry.collectDataTelemetry)({
      search,
      indices,
      logger,
      indicesStats,
      transportRequest
    });
    await savedObjectsClient.create(_apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_TYPE, { ...dataTelemetry,
      kibanaVersion
    }, {
      id: _apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_TYPE,
      overwrite: true
    });
  };

  const collector = usageCollector.makeUsageCollector({
    type: 'apm',
    schema: _schema.apmSchema,
    fetch: async () => {
      try {
        const {
          kibanaVersion: storedKibanaVersion,
          ...data
        } = (await savedObjectsClient.get(_apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_TYPE, _apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_ID)).attributes;
        return data;
      } catch (err) {
        if (_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
          // task has not run yet, so no saved object to return
          return {};
        }

        throw err;
      }
    },
    isReady: () => true
  });
  usageCollector.registerCollector(collector);
  core.getStartServices().then(async ([_coreStart, pluginsStart]) => {
    const {
      taskManager: taskManagerStart
    } = pluginsStart;
    taskManagerStart.ensureScheduled({
      id: APM_TELEMETRY_TASK_NAME,
      taskType: APM_TELEMETRY_TASK_NAME,
      schedule: {
        interval: '720m'
      },
      scope: ['apm'],
      params: {},
      state: {}
    });

    try {
      const currentData = (await savedObjectsClient.get(_apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_TYPE, _apm_saved_object_constants.APM_TELEMETRY_SAVED_OBJECT_ID)).attributes;

      if (currentData.kibanaVersion !== kibanaVersion) {
        logger.debug(`Stored telemetry is out of date. Task will run immediately. Stored: ${currentData.kibanaVersion}, expected: ${kibanaVersion}`);
        await taskManagerStart.runNow(APM_TELEMETRY_TASK_NAME);
      }
    } catch (err) {
      if (!_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
        logger.warn('Failed to fetch saved telemetry data.');
      }
    }
  });
}