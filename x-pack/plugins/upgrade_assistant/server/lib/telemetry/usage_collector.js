"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchUpgradeAssistantMetrics = fetchUpgradeAssistantMetrics;
exports.registerUpgradeAssistantUsageCollector = registerUpgradeAssistantUsageCollector;

var _lodash = require("lodash");

var _types = require("../../../common/types");

var _es_deprecation_logging_apis = require("../es_deprecation_logging_apis");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getSavedObjectAttributesFromRepo(savedObjectsRepository, docType, docID) {
  try {
    return (await savedObjectsRepository.get(docType, docID)).attributes;
  } catch (e) {
    return null;
  }
}

async function getDeprecationLoggingStatusValue(esClient) {
  try {
    const {
      body: loggerDeprecationCallResult
    } = await esClient.cluster.getSettings({
      include_defaults: true
    });
    return (0, _es_deprecation_logging_apis.isDeprecationLoggingEnabled)(loggerDeprecationCallResult);
  } catch (e) {
    return false;
  }
}

async function fetchUpgradeAssistantMetrics({
  client: esClient
}, savedObjects) {
  const savedObjectsRepository = savedObjects.createInternalRepository();
  const upgradeAssistantSOAttributes = await getSavedObjectAttributesFromRepo(savedObjectsRepository, _types.UPGRADE_ASSISTANT_TYPE, _types.UPGRADE_ASSISTANT_DOC_ID);
  const deprecationLoggingStatusValue = await getDeprecationLoggingStatusValue(esClient.asInternalUser);

  const getTelemetrySavedObject = upgradeAssistantTelemetrySavedObjectAttrs => {
    const defaultTelemetrySavedObject = {
      ui_open: {
        overview: 0,
        cluster: 0,
        indices: 0
      },
      ui_reindex: {
        close: 0,
        open: 0,
        start: 0,
        stop: 0
      }
    };

    if (!upgradeAssistantTelemetrySavedObjectAttrs) {
      return defaultTelemetrySavedObject;
    }

    return {
      ui_open: {
        overview: (0, _lodash.get)(upgradeAssistantTelemetrySavedObjectAttrs, 'ui_open.overview', 0),
        cluster: (0, _lodash.get)(upgradeAssistantTelemetrySavedObjectAttrs, 'ui_open.cluster', 0),
        indices: (0, _lodash.get)(upgradeAssistantTelemetrySavedObjectAttrs, 'ui_open.indices', 0)
      },
      ui_reindex: {
        close: (0, _lodash.get)(upgradeAssistantTelemetrySavedObjectAttrs, 'ui_reindex.close', 0),
        open: (0, _lodash.get)(upgradeAssistantTelemetrySavedObjectAttrs, 'ui_reindex.open', 0),
        start: (0, _lodash.get)(upgradeAssistantTelemetrySavedObjectAttrs, 'ui_reindex.start', 0),
        stop: (0, _lodash.get)(upgradeAssistantTelemetrySavedObjectAttrs, 'ui_reindex.stop', 0)
      }
    };
  };

  return { ...getTelemetrySavedObject(upgradeAssistantSOAttributes),
    features: {
      deprecation_logging: {
        enabled: deprecationLoggingStatusValue
      }
    }
  };
}

function registerUpgradeAssistantUsageCollector({
  elasticsearch,
  usageCollection,
  savedObjects
}) {
  const upgradeAssistantUsageCollector = usageCollection.makeUsageCollector({
    type: 'upgrade-assistant-telemetry',
    isReady: () => true,
    schema: {
      features: {
        deprecation_logging: {
          enabled: {
            type: 'boolean'
          }
        }
      },
      ui_open: {
        cluster: {
          type: 'long'
        },
        indices: {
          type: 'long'
        },
        overview: {
          type: 'long'
        }
      },
      ui_reindex: {
        close: {
          type: 'long'
        },
        open: {
          type: 'long'
        },
        start: {
          type: 'long'
        },
        stop: {
          type: 'long'
        }
      }
    },
    fetch: async () => fetchUpgradeAssistantMetrics(elasticsearch, savedObjects)
  });
  usageCollection.registerCollector(upgradeAssistantUsageCollector);
}