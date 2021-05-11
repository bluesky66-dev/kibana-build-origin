"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpacesUsageCollector = getSpacesUsageCollector;
exports.registerSpacesUsageCollector = registerSpacesUsageCollector;

var _operators = require("rxjs/operators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 *
 * @param {CallCluster} callCluster
 * @param {string} kibanaIndex
 * @param {PluginsSetup['features']} features
 * @param {boolean} spacesAvailable
 * @return {UsageData}
 */


async function getSpacesUsage(esClient, kibanaIndex, features, spacesAvailable) {
  var _hits$total$value, _hits$total, _aggregations$disable, _aggregations$disable2;

  if (!spacesAvailable) {
    return null;
  }

  const knownFeatureIds = features.getKibanaFeatures().map(feature => feature.id);
  let resp;

  try {
    ({
      body: resp
    } = await esClient.search({
      index: kibanaIndex,
      body: {
        track_total_hits: true,
        query: {
          term: {
            type: {
              value: 'space'
            }
          }
        },
        aggs: {
          disabledFeatures: {
            terms: {
              field: 'space.disabledFeatures',
              include: knownFeatureIds,
              size: knownFeatureIds.length
            }
          }
        },
        size: 0
      }
    }));
  } catch (err) {
    if (err.status === 404) {
      return null;
    }

    throw err;
  }

  const {
    hits,
    aggregations
  } = resp;
  const count = (_hits$total$value = hits === null || hits === void 0 ? void 0 : (_hits$total = hits.total) === null || _hits$total === void 0 ? void 0 : _hits$total.value) !== null && _hits$total$value !== void 0 ? _hits$total$value : 0;
  const disabledFeatureBuckets = (_aggregations$disable = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$disable2 = aggregations.disabledFeatures) === null || _aggregations$disable2 === void 0 ? void 0 : _aggregations$disable2.buckets) !== null && _aggregations$disable !== void 0 ? _aggregations$disable : [];
  const initialCounts = knownFeatureIds.reduce((acc, featureId) => ({ ...acc,
    [featureId]: 0
  }), {});
  const disabledFeatures = disabledFeatureBuckets.reduce( // eslint-disable-next-line @typescript-eslint/naming-convention
  (acc, {
    key,
    doc_count
  }) => {
    return { ...acc,
      [key]: doc_count
    };
  }, initialCounts);
  const usesFeatureControls = Object.values(disabledFeatures).some(disabledSpaceCount => disabledSpaceCount > 0);
  return {
    count,
    usesFeatureControls,
    disabledFeatures
  };
}

async function getUsageStats(usageStatsServicePromise, spacesAvailable) {
  if (!spacesAvailable) {
    return null;
  }

  const usageStatsClient = await usageStatsServicePromise.then(({
    getClient
  }) => getClient());
  return usageStatsClient.getUsageStats();
}
/*
 * @param {Object} server
 * @return {Object} kibana usage stats type collection object
 */


function getSpacesUsageCollector(usageCollection, deps) {
  return usageCollection.makeUsageCollector({
    type: 'spaces',
    isReady: () => true,
    schema: {
      usesFeatureControls: {
        type: 'boolean'
      },
      disabledFeatures: {
        indexPatterns: {
          type: 'long'
        },
        discover: {
          type: 'long'
        },
        canvas: {
          type: 'long'
        },
        maps: {
          type: 'long'
        },
        siem: {
          type: 'long'
        },
        monitoring: {
          type: 'long'
        },
        graph: {
          type: 'long'
        },
        uptime: {
          type: 'long'
        },
        savedObjectsManagement: {
          type: 'long'
        },
        timelion: {
          type: 'long'
        },
        dev_tools: {
          type: 'long'
        },
        advancedSettings: {
          type: 'long'
        },
        infrastructure: {
          type: 'long'
        },
        visualize: {
          type: 'long'
        },
        logs: {
          type: 'long'
        },
        dashboard: {
          type: 'long'
        },
        ml: {
          type: 'long'
        },
        apm: {
          type: 'long'
        }
      },
      available: {
        type: 'boolean'
      },
      enabled: {
        type: 'boolean'
      },
      count: {
        type: 'long'
      },
      'apiCalls.copySavedObjects.total': {
        type: 'long'
      },
      'apiCalls.copySavedObjects.kibanaRequest.yes': {
        type: 'long'
      },
      'apiCalls.copySavedObjects.kibanaRequest.no': {
        type: 'long'
      },
      'apiCalls.copySavedObjects.createNewCopiesEnabled.yes': {
        type: 'long'
      },
      'apiCalls.copySavedObjects.createNewCopiesEnabled.no': {
        type: 'long'
      },
      'apiCalls.copySavedObjects.overwriteEnabled.yes': {
        type: 'long'
      },
      'apiCalls.copySavedObjects.overwriteEnabled.no': {
        type: 'long'
      },
      'apiCalls.resolveCopySavedObjectsErrors.total': {
        type: 'long'
      },
      'apiCalls.resolveCopySavedObjectsErrors.kibanaRequest.yes': {
        type: 'long'
      },
      'apiCalls.resolveCopySavedObjectsErrors.kibanaRequest.no': {
        type: 'long'
      },
      'apiCalls.resolveCopySavedObjectsErrors.createNewCopiesEnabled.yes': {
        type: 'long'
      },
      'apiCalls.resolveCopySavedObjectsErrors.createNewCopiesEnabled.no': {
        type: 'long'
      }
    },
    fetch: async ({
      esClient
    }) => {
      const {
        licensing,
        kibanaIndexConfig$,
        features,
        usageStatsServicePromise
      } = deps;
      const license = await licensing.license$.pipe((0, _operators.take)(1)).toPromise();
      const available = license.isAvailable; // some form of spaces is available for all valid licenses

      const kibanaIndex = (await kibanaIndexConfig$.pipe((0, _operators.take)(1)).toPromise()).kibana.index;
      const usageData = await getSpacesUsage(esClient, kibanaIndex, features, available);
      const usageStats = await getUsageStats(usageStatsServicePromise, available);
      return {
        available,
        enabled: available,
        ...usageData,
        ...usageStats
      };
    }
  });
}

function registerSpacesUsageCollector(usageCollection, deps) {
  const collector = getSpacesUsageCollector(usageCollection, deps);
  usageCollection.registerCollector(collector);
}