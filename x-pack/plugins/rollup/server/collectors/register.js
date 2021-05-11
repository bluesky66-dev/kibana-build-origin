"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRollupUsageCollector = registerRollupUsageCollector;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// elasticsearch index.max_result_window default value


const ES_MAX_RESULT_WINDOW_DEFAULT_VALUE = 1000;

function getIdFromSavedObjectId(savedObjectId) {
  // The saved object ID is formatted `{TYPE}:{ID}`.
  return savedObjectId.split(':')[1];
}

function createIdToFlagMap(ids) {
  return ids.reduce((map, id) => {
    map[id] = true;
    return map;
  }, {});
}

async function fetchRollupIndexPatterns(kibanaIndex, esClient) {
  const searchParams = {
    size: ES_MAX_RESULT_WINDOW_DEFAULT_VALUE,
    index: kibanaIndex,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._id'],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              'index-pattern.type': 'rollup'
            }
          }
        }
      }
    }
  };
  const {
    body: esResponse
  } = await esClient.search(searchParams);
  return (0, _lodash.get)(esResponse, 'hits.hits', []).map(indexPattern => {
    const {
      _id: savedObjectId
    } = indexPattern;
    return getIdFromSavedObjectId(savedObjectId);
  });
}

async function fetchRollupSavedSearches(kibanaIndex, esClient, rollupIndexPatternToFlagMap) {
  const searchParams = {
    size: ES_MAX_RESULT_WINDOW_DEFAULT_VALUE,
    index: kibanaIndex,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._id', 'hits.hits._source.search.kibanaSavedObjectMeta'],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              type: 'search'
            }
          }
        }
      }
    }
  };
  const {
    body: esResponse
  } = await esClient.search(searchParams);
  const savedSearches = (0, _lodash.get)(esResponse, 'hits.hits', []); // Filter for ones with rollup index patterns.

  return savedSearches.reduce((rollupSavedSearches, savedSearch) => {
    const {
      _id: savedObjectId,
      _source: {
        search: {
          kibanaSavedObjectMeta: {
            searchSourceJSON
          }
        }
      }
    } = savedSearch;
    const searchSource = JSON.parse(searchSourceJSON);

    if (rollupIndexPatternToFlagMap[searchSource.index]) {
      const id = getIdFromSavedObjectId(savedObjectId);
      rollupSavedSearches.push(id);
    }

    return rollupSavedSearches;
  }, []);
}

async function fetchRollupVisualizations(kibanaIndex, esClient, rollupIndexPatternToFlagMap, rollupSavedSearchesToFlagMap) {
  const searchParams = {
    size: ES_MAX_RESULT_WINDOW_DEFAULT_VALUE,
    index: kibanaIndex,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.visualization.savedSearchRefName', 'hits.hits._source.visualization.kibanaSavedObjectMeta', 'hits.hits._source.references'],
    body: {
      query: {
        bool: {
          filter: {
            term: {
              type: 'visualization'
            }
          }
        }
      }
    }
  };
  const {
    body: esResponse
  } = await esClient.search(searchParams);
  const visualizations = (0, _lodash.get)(esResponse, 'hits.hits', []);
  let rollupVisualizations = 0;
  let rollupVisualizationsFromSavedSearches = 0;
  visualizations.forEach(visualization => {
    const references = (0, _lodash.get)(visualization, '_source.references');
    const savedSearchRefName = (0, _lodash.get)(visualization, '_source.visualization.savedSearchRefName');
    const searchSourceJSON = (0, _lodash.get)(visualization, '_source.visualization.kibanaSavedObjectMeta.searchSourceJSON');

    if (savedSearchRefName && references !== null && references !== void 0 && references.length) {
      // This visualization depends upon a saved search.
      const savedSearch = references.find(({
        name
      }) => name === savedSearchRefName);

      if (savedSearch && rollupSavedSearchesToFlagMap[savedSearch.id]) {
        rollupVisualizations++;
        rollupVisualizationsFromSavedSearches++;
      }
    } else if (searchSourceJSON) {
      // This visualization depends upon an index pattern.
      const searchSource = JSON.parse(searchSourceJSON);

      if (rollupIndexPatternToFlagMap[searchSource.index]) {
        rollupVisualizations++;
      }
    }

    return rollupVisualizations;
  });
  return {
    rollupVisualizations,
    rollupVisualizationsFromSavedSearches
  };
}

function registerRollupUsageCollector(usageCollection, kibanaIndex) {
  const collector = usageCollection.makeUsageCollector({
    type: 'rollups',
    isReady: () => true,
    schema: {
      index_patterns: {
        total: {
          type: 'long'
        }
      },
      saved_searches: {
        total: {
          type: 'long'
        }
      },
      visualizations: {
        saved_searches: {
          total: {
            type: 'long'
          }
        },
        total: {
          type: 'long'
        }
      }
    },
    fetch: async ({
      esClient
    }) => {
      const rollupIndexPatterns = await fetchRollupIndexPatterns(kibanaIndex, esClient);
      const rollupIndexPatternToFlagMap = createIdToFlagMap(rollupIndexPatterns);
      const rollupSavedSearches = await fetchRollupSavedSearches(kibanaIndex, esClient, rollupIndexPatternToFlagMap);
      const rollupSavedSearchesToFlagMap = createIdToFlagMap(rollupSavedSearches);
      const {
        rollupVisualizations,
        rollupVisualizationsFromSavedSearches
      } = await fetchRollupVisualizations(kibanaIndex, esClient, rollupIndexPatternToFlagMap, rollupSavedSearchesToFlagMap);
      return {
        index_patterns: {
          total: rollupIndexPatterns.length
        },
        saved_searches: {
          total: rollupSavedSearches.length
        },
        visualizations: {
          total: rollupVisualizations,
          saved_searches: {
            total: rollupVisualizationsFromSavedSearches
          }
        }
      };
    }
  });
  usageCollection.registerCollector(collector);
}