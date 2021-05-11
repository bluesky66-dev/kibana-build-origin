"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReindexWorker = createReindexWorker;
exports.registerReindexIndicesRoutes = registerReindexIndicesRoutes;

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../../../src/core/server");

var _types = require("../../../common/types");

var _es_version_precheck = require("../../lib/es_version_precheck");

var _reindexing = require("../../lib/reindexing");

var _reindex_actions = require("../../lib/reindexing/reindex_actions");

var _op_utils = require("../../lib/reindexing/op_utils");

var _error = require("../../lib/reindexing/error");

var _error_symbols = require("../../lib/reindexing/error_symbols");

var _reindex_handler = require("./reindex_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createReindexWorker({
  logger,
  elasticsearchService,
  credentialStore,
  savedObjects,
  licensing,
  apmIndexPatterns
}) {
  const esClient = elasticsearchService.client;
  return new _reindexing.ReindexWorker(savedObjects, credentialStore, esClient, logger, licensing, apmIndexPatterns);
}

const mapAnyErrorToKibanaHttpResponse = e => {
  if (e instanceof _error.ReindexError) {
    switch (e.symbol) {
      case _error_symbols.AccessForbidden:
        return _server.kibanaResponseFactory.forbidden({
          body: e.message
        });

      case _error_symbols.IndexNotFound:
        return _server.kibanaResponseFactory.notFound({
          body: e.message
        });

      case _error_symbols.CannotCreateIndex:
      case _error_symbols.ReindexTaskCannotBeDeleted:
        return _server.kibanaResponseFactory.internalError({
          body: e.message
        });

      case _error_symbols.ReindexTaskFailed:
        // Bad data
        return _server.kibanaResponseFactory.customError({
          body: e.message,
          statusCode: 422
        });

      case _error_symbols.ReindexAlreadyInProgress:
      case _error_symbols.MultipleReindexJobsFound:
      case _error_symbols.ReindexCannotBeCancelled:
        return _server.kibanaResponseFactory.badRequest({
          body: e.message
        });

      case _error_symbols.CannotReindexSystemIndexInCurrent:
        // Not implemented (specific to current version)
        return _server.kibanaResponseFactory.customError({
          body: e.message,
          statusCode: 501
        });

      default: // nothing matched

    }
  }

  return _server.kibanaResponseFactory.internalError({
    body: e
  });
};

function registerReindexIndicesRoutes({
  credentialStore,
  router,
  licensing,
  log
}, getWorker) {
  const BASE_PATH = '/api/upgrade_assistant/reindex'; // Start reindex for an index

  router.post({
    path: `${BASE_PATH}/{indexName}`,
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      savedObjects: {
        client: savedObjectsClient
      },
      elasticsearch: {
        client: esClient
      }
    }
  }, request, response) => {
    const {
      indexName
    } = request.params;

    try {
      const result = await (0, _reindex_handler.reindexHandler)({
        savedObjects: savedObjectsClient,
        dataClient: esClient,
        indexName,
        log,
        licensing,
        headers: request.headers,
        credentialStore
      }); // Kick the worker on this node to immediately pickup the new reindex operation.

      getWorker().forceRefresh();
      return response.ok({
        body: result
      });
    } catch (e) {
      return mapAnyErrorToKibanaHttpResponse(e);
    }
  })); // Get the current batch queue

  router.get({
    path: `${BASE_PATH}/batch/queue`,
    validate: {}
  }, async ({
    core: {
      elasticsearch: {
        client: esClient
      },
      savedObjects
    }
  }, request, response) => {
    const {
      client
    } = savedObjects;
    const callAsCurrentUser = esClient.asCurrentUser;
    const reindexActions = (0, _reindex_actions.reindexActionsFactory)(client, callAsCurrentUser);

    try {
      const inProgressOps = await reindexActions.findAllByStatus(_types.ReindexStatus.inProgress);
      const {
        queue
      } = (0, _op_utils.sortAndOrderReindexOperations)(inProgressOps);
      const result = {
        queue: queue.map(savedObject => savedObject.attributes)
      };
      return response.ok({
        body: result
      });
    } catch (e) {
      return mapAnyErrorToKibanaHttpResponse(e);
    }
  }); // Add indices for reindexing to the worker's batch

  router.post({
    path: `${BASE_PATH}/batch`,
    validate: {
      body: _configSchema.schema.object({
        indexNames: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      savedObjects: {
        client: savedObjectsClient
      },
      elasticsearch: {
        client: esClient
      }
    }
  }, request, response) => {
    const {
      indexNames
    } = request.body;
    const results = {
      enqueued: [],
      errors: []
    };

    for (const indexName of indexNames) {
      try {
        const result = await (0, _reindex_handler.reindexHandler)({
          savedObjects: savedObjectsClient,
          dataClient: esClient,
          indexName,
          log,
          licensing,
          headers: request.headers,
          credentialStore,
          reindexOptions: {
            enqueue: true
          }
        });
        results.enqueued.push(result);
      } catch (e) {
        results.errors.push({
          indexName,
          message: e.message
        });
      }
    }

    if (results.errors.length < indexNames.length) {
      // Kick the worker on this node to immediately pickup the batch.
      getWorker().forceRefresh();
    }

    return response.ok({
      body: results
    });
  })); // Get status

  router.get({
    path: `${BASE_PATH}/{indexName}`,
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      savedObjects,
      elasticsearch: {
        client: esClient
      }
    }
  }, request, response) => {
    const {
      client
    } = savedObjects;
    const {
      indexName
    } = request.params;
    const asCurrentUser = esClient.asCurrentUser;
    const reindexActions = (0, _reindex_actions.reindexActionsFactory)(client, asCurrentUser);
    const reindexService = (0, _reindexing.reindexServiceFactory)(asCurrentUser, reindexActions, log, licensing);

    try {
      const hasRequiredPrivileges = await reindexService.hasRequiredPrivileges(indexName);
      const reindexOp = await reindexService.findReindexOperation(indexName); // If the user doesn't have privileges than querying for warnings is going to fail.

      const warnings = hasRequiredPrivileges ? await reindexService.detectReindexWarnings(indexName) : [];
      const indexGroup = reindexService.getIndexGroup(indexName);
      return response.ok({
        body: {
          reindexOp: reindexOp ? reindexOp.attributes : null,
          warnings,
          indexGroup,
          hasRequiredPrivileges
        }
      });
    } catch (e) {
      return mapAnyErrorToKibanaHttpResponse(e);
    }
  })); // Cancel reindex

  router.post({
    path: `${BASE_PATH}/{indexName}/cancel`,
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core: {
      savedObjects,
      elasticsearch: {
        client: esClient
      }
    }
  }, request, response) => {
    const {
      indexName
    } = request.params;
    const {
      client
    } = savedObjects;
    const callAsCurrentUser = esClient.asCurrentUser;
    const reindexActions = (0, _reindex_actions.reindexActionsFactory)(client, callAsCurrentUser);
    const reindexService = (0, _reindexing.reindexServiceFactory)(callAsCurrentUser, reindexActions, log, licensing);

    try {
      await reindexService.cancelReindexing(indexName);
      return response.ok({
        body: {
          acknowledged: true
        }
      });
    } catch (e) {
      return mapAnyErrorToKibanaHttpResponse(e);
    }
  }));
}