"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserializeAutoFollowStats = exports.deserializeAutoFollowedClusters = exports.deserializeRecentAutoFollowErrors = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */

const deserializeRecentAutoFollowErrors = ({
  timestamp,
  leader_index,
  auto_follow_exception: {
    type,
    reason
  }
}) => ({
  timestamp,
  leaderIndex: leader_index,
  autoFollowException: {
    type,
    reason
  }
});

exports.deserializeRecentAutoFollowErrors = deserializeRecentAutoFollowErrors;

const deserializeAutoFollowedClusters = ({
  cluster_name,
  time_since_last_check_millis,
  last_seen_metadata_version
}) => ({
  clusterName: cluster_name,
  timeSinceLastCheckMillis: time_since_last_check_millis,
  lastSeenMetadataVersion: last_seen_metadata_version
});

exports.deserializeAutoFollowedClusters = deserializeAutoFollowedClusters;

const deserializeAutoFollowStats = ({
  number_of_failed_follow_indices,
  number_of_failed_remote_cluster_state_requests,
  number_of_successful_follow_indices,
  recent_auto_follow_errors,
  auto_followed_clusters
}) => ({
  numberOfFailedFollowIndices: number_of_failed_follow_indices,
  numberOfFailedRemoteClusterStateRequests: number_of_failed_remote_cluster_state_requests,
  numberOfSuccessfulFollowIndices: number_of_successful_follow_indices,
  recentAutoFollowErrors: recent_auto_follow_errors.map(deserializeRecentAutoFollowErrors),
  autoFollowedClusters: auto_followed_clusters.map(deserializeAutoFollowedClusters)
});

exports.deserializeAutoFollowStats = deserializeAutoFollowStats;