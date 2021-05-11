"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processStatsResults = processStatsResults;
exports.processLogstashStateResults = processLogstashStateResults;
exports.fetchLogstashStats = fetchLogstashStats;
exports.fetchLogstashState = fetchLogstashState;
exports.getLogstashStats = getLogstashStats;

var _create_query = require("./create_query");

var _get_high_level_stats = require("./get_high_level_stats");

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const HITS_SIZE = 10000; // maximum hits to receive from ES with each search

const getLogstashBaseStats = () => ({
  versions: [],
  count: 0,
  cluster_stats: {
    pipelines: {},
    plugins: []
  }
});
/*
 * Update a clusters object with processed Logstash stats
 * @param {Array} results - array of LogstashStats docs from ES
 * @param {Object} clusters - LogstashBaseStats in an object keyed by the cluster UUIDs
 * @param {Object} allEphemeralIds - EphemeralIds in an object keyed by cluster UUIDs to track the pipelines for the cluster
 * @param {Object} versions - Versions in an object keyed by cluster UUIDs to track the logstash versions for the cluster
 * @param {Object} plugins - plugin information keyed by cluster UUIDs to count the unique plugins
 */


function processStatsResults(results, {
  clusters,
  allEphemeralIds,
  versions,
  plugins
}) {
  var _results$hits;

  const currHits = (results === null || results === void 0 ? void 0 : (_results$hits = results.hits) === null || _results$hits === void 0 ? void 0 : _results$hits.hits) || [];
  currHits.forEach(hit => {
    const clusterUuid = hit._source.cluster_uuid;

    if (clusters[clusterUuid] === undefined) {
      clusters[clusterUuid] = getLogstashBaseStats();
      versions[clusterUuid] = new Map();
      plugins[clusterUuid] = new Map();
    }

    const logstashStats = hit._source.logstash_stats;
    const clusterStats = clusters[clusterUuid].cluster_stats;

    if (clusterStats !== undefined && logstashStats !== undefined) {
      var _logstashStats$logsta, _hit$_source$agent;

      clusters[clusterUuid].count = (clusters[clusterUuid].count || 0) + 1;
      const thisVersion = (_logstashStats$logsta = logstashStats.logstash) === null || _logstashStats$logsta === void 0 ? void 0 : _logstashStats$logsta.version;
      const a = versions[clusterUuid];
      (0, _get_high_level_stats.incrementByKey)(a, thisVersion);
      clusters[clusterUuid].versions = (0, _get_high_level_stats.mapToList)(a, 'version'); // Internal Collection has no agent field, so default to 'internal_collection'

      let thisCollectionType = (_hit$_source$agent = hit._source.agent) === null || _hit$_source$agent === void 0 ? void 0 : _hit$_source$agent.type;

      if (thisCollectionType === undefined) {
        thisCollectionType = 'internal_collection';
      }

      if (!clusterStats.hasOwnProperty('collection_types')) {
        clusterStats.collection_types = {};
      }

      clusterStats.collection_types[thisCollectionType] = (clusterStats.collection_types[thisCollectionType] || 0) + 1;
      const pipelines = logstashStats.pipelines || [];
      pipelines.forEach(pipeline => {
        var _pipeline$queue;

        const thisQueueType = (_pipeline$queue = pipeline.queue) === null || _pipeline$queue === void 0 ? void 0 : _pipeline$queue.type;

        if (thisQueueType !== undefined) {
          if (!clusterStats.hasOwnProperty('queues')) {
            clusterStats.queues = {};
          }

          clusterStats.queues[thisQueueType] = (clusterStats.queues[thisQueueType] || 0) + 1;
        }

        const ephemeralId = pipeline.ephemeral_id;

        if (ephemeralId !== undefined) {
          allEphemeralIds[clusterUuid] = allEphemeralIds[clusterUuid] || [];
          allEphemeralIds[clusterUuid].push(ephemeralId);
        }
      });
    }
  });
}
/*
 * Update a clusters object with logstash state details
 * @param {Array} results - array of LogstashState docs from ES
 * @param {Object} clusters - LogstashBaseStats in an object keyed by the cluster UUIDs
 * @param {Object} plugins - plugin information keyed by cluster UUIDs to count the unique plugins
 */


function processLogstashStateResults(results, clusterUuid, {
  clusters,
  plugins
}) {
  var _results$hits2, _clusters$clusterUuid;

  const currHits = (results === null || results === void 0 ? void 0 : (_results$hits2 = results.hits) === null || _results$hits2 === void 0 ? void 0 : _results$hits2.hits) || [];
  const clusterStats = clusters[clusterUuid].cluster_stats;
  const pipelineStats = (_clusters$clusterUuid = clusters[clusterUuid].cluster_stats) === null || _clusters$clusterUuid === void 0 ? void 0 : _clusters$clusterUuid.pipelines;
  currHits.forEach(hit => {
    var _hit$_source$logstash;

    const thisLogstashStatePipeline = (_hit$_source$logstash = hit._source.logstash_state) === null || _hit$_source$logstash === void 0 ? void 0 : _hit$_source$logstash.pipeline;

    if (pipelineStats !== undefined && thisLogstashStatePipeline !== undefined) {
      var _thisLogstashStatePip, _thisLogstashStatePip2;

      pipelineStats.count = (pipelineStats.count || 0) + 1;
      const thisPipelineBatchSize = thisLogstashStatePipeline.batch_size;

      if (thisPipelineBatchSize !== undefined) {
        pipelineStats.batch_size_total = (pipelineStats.batch_size_total || 0) + thisPipelineBatchSize;
        pipelineStats.batch_size_max = pipelineStats.batch_size_max || 0;
        pipelineStats.batch_size_min = pipelineStats.batch_size_min || 0;
        pipelineStats.batch_size_avg = pipelineStats.batch_size_total / pipelineStats.count;

        if (thisPipelineBatchSize > pipelineStats.batch_size_max) {
          pipelineStats.batch_size_max = thisPipelineBatchSize;
        }

        if (pipelineStats.batch_size_min === 0 || thisPipelineBatchSize < pipelineStats.batch_size_min) {
          pipelineStats.batch_size_min = thisPipelineBatchSize;
        }
      }

      const thisPipelineWorkers = thisLogstashStatePipeline.workers;

      if (thisPipelineWorkers !== undefined) {
        pipelineStats.workers_total = (pipelineStats.workers_total || 0) + thisPipelineWorkers;
        pipelineStats.workers_max = pipelineStats.workers_max || 0;
        pipelineStats.workers_min = pipelineStats.workers_min || 0;
        pipelineStats.workers_avg = pipelineStats.workers_total / pipelineStats.count;

        if (thisPipelineWorkers > pipelineStats.workers_max) {
          pipelineStats.workers_max = thisPipelineWorkers;
        }

        if (pipelineStats.workers_min === 0 || thisPipelineWorkers < pipelineStats.workers_min) {
          pipelineStats.workers_min = thisPipelineWorkers;
        }
      } // Extract the vertices object from the pipeline representation. From this, we can
      // retrieve the source of the pipeline element on the configuration(from file, string, or
      // x-pack-config-management), and the input, filter and output plugins from that pipeline.


      const vertices = (_thisLogstashStatePip = thisLogstashStatePipeline.representation) === null || _thisLogstashStatePip === void 0 ? void 0 : (_thisLogstashStatePip2 = _thisLogstashStatePip.graph) === null || _thisLogstashStatePip2 === void 0 ? void 0 : _thisLogstashStatePip2.vertices;

      if (vertices !== undefined) {
        vertices.forEach(vertex => {
          var _vertex$meta, _vertex$meta$source;

          const configName = vertex.config_name;
          const pluginType = vertex.plugin_type;
          let pipelineConfig = (_vertex$meta = vertex.meta) === null || _vertex$meta === void 0 ? void 0 : (_vertex$meta$source = _vertex$meta.source) === null || _vertex$meta$source === void 0 ? void 0 : _vertex$meta$source.protocol;

          if (pipelineConfig !== undefined) {
            if (pipelineConfig === 'string' || pipelineConfig === 'str') {
              pipelineConfig = 'string';
            } else if (pipelineConfig === 'x-pack-config-management') {
              pipelineConfig = 'xpack';
            } else {
              pipelineConfig = 'file';
            }

            if (!pipelineStats.hasOwnProperty('sources')) {
              pipelineStats.sources = {};
            }

            pipelineStats.sources[pipelineConfig] = true;
          }

          if (configName !== undefined && pluginType !== undefined) {
            (0, _get_high_level_stats.incrementByKey)(plugins[clusterUuid], `logstash-${pluginType}-${configName}`);
          }
        });
      }
    }
  });

  if (clusterStats !== undefined) {
    clusterStats.plugins = (0, _get_high_level_stats.mapToList)(plugins[clusterUuid], 'name');
  }
}

async function fetchLogstashStats(callCluster, clusterUuids, {
  page = 0,
  ...options
}) {
  var _results$hits3;

  const params = {
    headers: {
      'X-QUERY-SOURCE': _constants.TELEMETRY_QUERY_SOURCE
    },
    index: _constants.INDEX_PATTERN_LOGSTASH,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.cluster_uuid', 'hits.hits._source.type', 'hits.hits._source.source_node', 'hits.hits._source.agent.type', 'hits.hits._source.logstash_stats.pipelines.id', 'hits.hits._source.logstash_stats.pipelines.ephemeral_id', 'hits.hits._source.logstash_stats.pipelines.queue.type', 'hits.hits._source.logstash_stats.logstash.version', 'hits.hits._source.logstash_stats.logstash.uuid'],
    body: {
      query: (0, _create_query.createQuery)({
        filters: [{
          terms: {
            cluster_uuid: clusterUuids
          }
        }, {
          bool: {
            must: {
              term: {
                type: 'logstash_stats'
              }
            }
          }
        }]
      }),
      from: page * HITS_SIZE,
      collapse: {
        field: 'logstash_stats.logstash.uuid'
      },
      sort: [{
        ['logstash_stats.timestamp']: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      size: HITS_SIZE
    }
  };
  const results = await callCluster('search', params);
  const hitsLength = (results === null || results === void 0 ? void 0 : (_results$hits3 = results.hits) === null || _results$hits3 === void 0 ? void 0 : _results$hits3.hits.length) || 0;

  if (hitsLength > 0) {
    // further augment the clusters object with more stats
    processStatsResults(results, options);

    if (hitsLength === HITS_SIZE) {
      // call recursively
      const nextOptions = {
        page: page + 1,
        ...options
      }; // returns a promise and keeps the caller blocked from returning until the entire clusters object is built

      return fetchLogstashStats(callCluster, clusterUuids, nextOptions);
    }
  }

  return Promise.resolve();
}

async function fetchLogstashState(callCluster, clusterUuid, ephemeralIds, {
  page = 0,
  ...options
}) {
  var _results$hits4;

  const params = {
    headers: {
      'X-QUERY-SOURCE': _constants.TELEMETRY_QUERY_SOURCE
    },
    index: _constants.INDEX_PATTERN_LOGSTASH,
    ignoreUnavailable: true,
    filterPath: ['hits.hits._source.logstash_state.pipeline.batch_size', 'hits.hits._source.logstash_state.pipeline.workers', 'hits.hits._source.logstash_state.pipeline.representation.graph.vertices.config_name', 'hits.hits._source.logstash_state.pipeline.representation.graph.vertices.plugin_type', 'hits.hits._source.logstash_state.pipeline.representation.graph.vertices.meta.source.protocol', 'hits.hits._source.logstash_state.pipeline.representation.graph.vertices', 'hits.hits._source.type'],
    body: {
      query: (0, _create_query.createQuery)({
        filters: [{
          terms: {
            'logstash_state.pipeline.ephemeral_id': ephemeralIds
          }
        }, {
          bool: {
            must: {
              term: {
                type: 'logstash_state'
              }
            }
          }
        }]
      }),
      from: page * HITS_SIZE,
      collapse: {
        field: 'logstash_state.pipeline.ephemeral_id'
      },
      sort: [{
        ['timestamp']: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      size: HITS_SIZE
    }
  };
  const results = await callCluster('search', params);
  const hitsLength = (results === null || results === void 0 ? void 0 : (_results$hits4 = results.hits) === null || _results$hits4 === void 0 ? void 0 : _results$hits4.hits.length) || 0;

  if (hitsLength > 0) {
    // further augment the clusters object with more stats
    processLogstashStateResults(results, clusterUuid, options);

    if (hitsLength === HITS_SIZE) {
      // call recursively
      const nextOptions = {
        page: page + 1,
        ...options
      }; // returns a promise and keeps the caller blocked from returning until the entire clusters object is built

      return fetchLogstashState(callCluster, clusterUuid, ephemeralIds, nextOptions);
    }
  }

  return Promise.resolve();
}
/*
 * Call the function for fetching and summarizing Logstash stats
 * @return {Object} - Logstash stats in an object keyed by the cluster UUIDs
 */


async function getLogstashStats(callCluster, clusterUuids) {
  const options = {
    clusters: {},
    // the result object to be built up
    allEphemeralIds: {},
    versions: {},
    plugins: {}
  };
  await fetchLogstashStats(callCluster, clusterUuids, options);
  await Promise.all(clusterUuids.map(async clusterUuid => {
    if (options.clusters[clusterUuid] !== undefined) {
      await fetchLogstashState(callCluster, clusterUuid, options.allEphemeralIds[clusterUuid], options);
    }
  }));
  return options.clusters;
}