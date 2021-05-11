"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeAutoFollowPattern = exports.deserializeListAutoFollowPatterns = exports.deserializeAutoFollowPattern = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deserializeAutoFollowPattern = autoFollowPattern => {
  const {
    name,
    pattern: {
      active,
      remote_cluster: remoteCluster,
      leader_index_patterns: leaderIndexPatterns,
      follow_index_pattern: followIndexPattern
    }
  } = autoFollowPattern;
  return {
    name,
    active,
    remoteCluster,
    leaderIndexPatterns,
    followIndexPattern
  };
};

exports.deserializeAutoFollowPattern = deserializeAutoFollowPattern;

const deserializeListAutoFollowPatterns = autoFollowPatterns => autoFollowPatterns.map(deserializeAutoFollowPattern);

exports.deserializeListAutoFollowPatterns = deserializeListAutoFollowPatterns;

const serializeAutoFollowPattern = ({
  remoteCluster,
  leaderIndexPatterns,
  followIndexPattern
}) => ({
  remote_cluster: remoteCluster,
  leader_index_patterns: leaderIndexPatterns,
  follow_index_pattern: followIndexPattern
});

exports.serializeAutoFollowPattern = serializeAutoFollowPattern;