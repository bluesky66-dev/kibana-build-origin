"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeNodeShards = normalizeNodeShards;
exports.normalizeIndexShards = normalizeIndexShards;

var _lodash = require("lodash");

var _nodes = require("../nodes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Reducer function for a set of nodes to key the array by nodeId, summarize
 * the shard data, and use calculateNodeType to determine if the node type is master
 * @param masterNode = nodeId of master node
 * @return reducer function for set of nodes
 */


function normalizeNodeShards(masterNode) {
  return (nodes, node) => {
    if (node.key && node.node_ids) {
      const nodeIds = node.node_ids.buckets.map(b => b.key);
      const _node = { ...node,
        node_ids: nodeIds
      };
      return { ...nodes,
        [node.key]: {
          shardCount: node.doc_count,
          indexCount: (0, _lodash.get)(node, 'index_count.value'),
          name: (0, _lodash.get)(node, 'node_names.buckets[0].key'),
          node_ids: nodeIds,
          type: (0, _nodes.calculateNodeType)(_node, masterNode) // put the "star" icon on the node link in the shard allocator

        }
      };
    }

    return nodes;
  };
}

const countShards = shardBuckets => {
  let primaryShards = 0;
  let replicaShards = 0;
  shardBuckets.forEach(shard => {
    const primaryMap = (0, _lodash.get)(shard, 'primary.buckets', []);
    const primaryBucket = primaryMap.find(b => b.key_as_string === 'true');

    if (primaryBucket !== undefined) {
      primaryShards += primaryBucket.doc_count;
    }

    const replicaBucket = primaryMap.find(b => b.key_as_string === 'false');

    if (replicaBucket !== undefined) {
      replicaShards += replicaBucket.doc_count;
    }
  });
  return {
    primaryShards,
    replicaShards
  };
};
/*
 * Reducer function for a set of indices to key the array by index name, and
 * summarize the shard data.
 * @return reducer function for set of indices
 */


function normalizeIndexShards(indices, index) {
  const stateBuckets = (0, _lodash.get)(index, 'states.buckets', []);
  const [assignedShardBuckets, unassignedShardBuckets] = (0, _lodash.partition)(stateBuckets, b => {
    return b.key === 'STARTED' || b.key === 'RELOCATING';
  });
  const {
    primaryShards: primary,
    replicaShards: replica
  } = countShards(assignedShardBuckets);
  const {
    primaryShards: unassignedPrimary,
    replicaShards: unassignedReplica
  } = countShards(unassignedShardBuckets);
  let status = 'green';

  if (unassignedReplica > 0) {
    status = 'yellow';
  }

  if (unassignedPrimary > 0) {
    status = 'red';
  }

  return { ...indices,
    [index.key]: {
      status,
      primary,
      replica,
      unassigned: {
        primary: unassignedPrimary,
        replica: unassignedReplica
      }
    }
  };
}