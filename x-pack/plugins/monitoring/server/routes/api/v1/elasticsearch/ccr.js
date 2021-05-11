"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ccrRoute = ccrRoute;

var _configSchema = require("@kbn/config-schema");

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

var _handle_error = require("../../../../lib/errors/handle_error");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _constants = require("../../../../../common/constants");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore
// @ts-ignore


function getBucketScript(max, min) {
  return {
    bucket_script: {
      buckets_path: {
        max,
        min
      },
      script: 'params.max - params.min'
    }
  };
}

function buildRequest(req, config, esIndexPattern) {
  const min = _moment.default.utc(req.payload.timeRange.min).valueOf();

  const max = _moment.default.utc(req.payload.timeRange.max).valueOf();

  const maxBucketSize = config.get('monitoring.ui.max_bucket_size');
  const aggs = {
    ops_synced_max: {
      max: {
        field: 'ccr_stats.operations_written'
      }
    },
    ops_synced_min: {
      min: {
        field: 'ccr_stats.operations_written'
      }
    },
    lag_ops_leader_max: {
      max: {
        field: 'ccr_stats.leader_max_seq_no'
      }
    },
    lag_ops_leader_min: {
      min: {
        field: 'ccr_stats.leader_max_seq_no'
      }
    },
    lag_ops_global_max: {
      max: {
        field: 'ccr_stats.follower_global_checkpoint'
      }
    },
    lag_ops_global_min: {
      min: {
        field: 'ccr_stats.follower_global_checkpoint'
      }
    },
    leader_lag_ops_checkpoint_max: {
      max: {
        field: 'ccr_stats.leader_global_checkpoint'
      }
    },
    leader_lag_ops_checkpoint_min: {
      min: {
        field: 'ccr_stats.leader_global_checkpoint'
      }
    },
    ops_synced: getBucketScript('ops_synced_max', 'ops_synced_min'),
    lag_ops_leader: getBucketScript('lag_ops_leader_max', 'lag_ops_leader_min'),
    lag_ops_global: getBucketScript('lag_ops_global_max', 'lag_ops_global_min'),
    lag_ops: getBucketScript('lag_ops_leader', 'lag_ops_global'),
    lag_ops_leader_checkpoint: getBucketScript('leader_lag_ops_checkpoint_max', 'leader_lag_ops_checkpoint_min'),
    leader_lag_ops: getBucketScript('lag_ops_leader', 'lag_ops_leader_checkpoint'),
    follower_lag_ops: getBucketScript('lag_ops_leader_checkpoint', 'lag_ops_global')
  };
  return {
    index: esIndexPattern,
    size: maxBucketSize,
    filterPath: ['hits.hits.inner_hits.by_shard.hits.hits._source.ccr_stats.read_exceptions', 'hits.hits.inner_hits.by_shard.hits.hits._source.ccr_stats.follower_index', 'hits.hits.inner_hits.by_shard.hits.hits._source.ccr_stats.shard_id', 'hits.hits.inner_hits.by_shard.hits.hits._source.ccr_stats.time_since_last_read_millis', 'aggregations.by_follower_index.buckets.key', 'aggregations.by_follower_index.buckets.leader_index.buckets.key', 'aggregations.by_follower_index.buckets.leader_index.buckets.remote_cluster.buckets.key', 'aggregations.by_follower_index.buckets.by_shard_id.buckets.key', 'aggregations.by_follower_index.buckets.by_shard_id.buckets.ops_synced.value', 'aggregations.by_follower_index.buckets.by_shard_id.buckets.lag_ops.value', 'aggregations.by_follower_index.buckets.by_shard_id.buckets.leader_lag_ops.value', 'aggregations.by_follower_index.buckets.by_shard_id.buckets.follower_lag_ops.value'],
    body: {
      sort: [{
        timestamp: {
          order: 'desc',
          unmapped_type: 'long'
        }
      }],
      query: {
        bool: {
          must: [{
            term: {
              type: {
                value: 'ccr_stats'
              }
            }
          }, {
            range: {
              timestamp: {
                format: 'epoch_millis',
                gte: min,
                lte: max
              }
            }
          }]
        }
      },
      collapse: {
        field: 'ccr_stats.follower_index',
        inner_hits: {
          name: 'by_shard',
          sort: [{
            timestamp: {
              order: 'desc',
              unmapped_type: 'long'
            }
          }],
          size: maxBucketSize,
          collapse: {
            field: 'ccr_stats.shard_id'
          }
        }
      },
      aggs: {
        by_follower_index: {
          terms: {
            field: 'ccr_stats.follower_index',
            size: maxBucketSize
          },
          aggs: {
            leader_index: {
              terms: {
                field: 'ccr_stats.leader_index',
                size: 1
              },
              aggs: {
                remote_cluster: {
                  terms: {
                    field: 'ccr_stats.remote_cluster',
                    size: 1
                  }
                }
              }
            },
            by_shard_id: {
              terms: {
                field: 'ccr_stats.shard_id',
                size: 10
              },
              aggs
            }
          }
        }
      }
    }
  };
}

function ccrRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/elasticsearch/ccr',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string()
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          })
        })
      }
    },

    async handler(req) {
      const config = server.config();
      const ccs = req.payload.ccs;
      const esIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_ELASTICSEARCH, ccs);

      try {
        var _response$hits$hits$r, _response$hits;

        const {
          callWithRequest
        } = req.server.plugins.elasticsearch.getCluster('monitoring');
        const response = await callWithRequest(req, 'search', buildRequest(req, config, esIndexPattern));

        if (!response || Object.keys(response).length === 0) {
          return {
            data: []
          };
        }

        const fullStats = (_response$hits$hits$r = (_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits.reduce((accum, hit) => {
          var _hit$inner_hits$by_sh, _hit$inner_hits, _hit$inner_hits$by_sh2;

          const innerHits = (_hit$inner_hits$by_sh = (_hit$inner_hits = hit.inner_hits) === null || _hit$inner_hits === void 0 ? void 0 : (_hit$inner_hits$by_sh2 = _hit$inner_hits.by_shard.hits) === null || _hit$inner_hits$by_sh2 === void 0 ? void 0 : _hit$inner_hits$by_sh2.hits) !== null && _hit$inner_hits$by_sh !== void 0 ? _hit$inner_hits$by_sh : [];
          const innerHitsSource = innerHits.map(innerHit => innerHit._source.ccr_stats);
          const grouped = (0, _lodash.groupBy)(innerHitsSource, stat => `${stat.follower_index}:${stat.shard_id}`);
          return { ...accum,
            ...grouped
          };
        }, {})) !== null && _response$hits$hits$r !== void 0 ? _response$hits$hits$r : {};
        const buckets = response.aggregations.by_follower_index.buckets;
        const data = buckets.reduce((accum, bucket) => {
          const leaderIndex = (0, _lodash.get)(bucket, 'leader_index.buckets[0].key');
          const remoteCluster = (0, _lodash.get)(bucket, 'leader_index.buckets[0].remote_cluster.buckets[0].key');
          const follows = remoteCluster ? `${leaderIndex} on ${remoteCluster}` : leaderIndex;
          const stat = {
            id: bucket.key,
            index: bucket.key,
            follows,
            shards: [],
            error: undefined,
            opsSynced: undefined,
            syncLagTime: undefined,
            syncLagOps: undefined
          };
          stat.shards = (0, _lodash.get)(bucket, 'by_shard_id.buckets').reduce((accum2, shardBucket) => {
            var _fullStats$$, _fullStat$read_except, _fullStat$read_except2;

            const fullStat = (_fullStats$$ = fullStats[`${bucket.key}:${shardBucket.key}`][0]) !== null && _fullStats$$ !== void 0 ? _fullStats$$ : {};
            const shardStat = {
              shardId: shardBucket.key,
              error: (_fullStat$read_except = fullStat.read_exceptions) !== null && _fullStat$read_except !== void 0 && _fullStat$read_except.length ? (_fullStat$read_except2 = fullStat.read_exceptions[0].exception) === null || _fullStat$read_except2 === void 0 ? void 0 : _fullStat$read_except2.type : null,
              opsSynced: (0, _lodash.get)(shardBucket, 'ops_synced.value'),
              syncLagTime: fullStat.time_since_last_read_millis,
              syncLagOps: (0, _lodash.get)(shardBucket, 'lag_ops.value'),
              syncLagOpsLeader: (0, _lodash.get)(shardBucket, 'leader_lag_ops.value'),
              syncLagOpsFollower: (0, _lodash.get)(shardBucket, 'follower_lag_ops.value')
            };
            accum2.push(shardStat);
            return accum2;
          }, []);
          stat.error = (stat.shards.find(shard => shard.error) || {}).error;
          stat.opsSynced = stat.shards.reduce((sum, {
            opsSynced
          }) => sum + opsSynced, 0);
          stat.syncLagTime = stat.shards.reduce((max, {
            syncLagTime
          }) => Math.max(max, syncLagTime), 0);
          stat.syncLagOps = stat.shards.reduce((max, {
            syncLagOps
          }) => Math.max(max, syncLagOps), 0);
          accum.push(stat);
          return accum;
        }, []);
        return {
          data
        };
      } catch (err) {
        return (0, _handle_error.handleError)(err, req);
      }
    }

  });
}