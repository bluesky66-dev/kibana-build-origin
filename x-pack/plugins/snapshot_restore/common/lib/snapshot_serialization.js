"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserializeSnapshotDetails = deserializeSnapshotDetails;
exports.deserializeSnapshotConfig = deserializeSnapshotConfig;
exports.serializeSnapshotConfig = serializeSnapshotConfig;
exports.deserializeSnapshotRetention = deserializeSnapshotRetention;
exports.serializeSnapshotRetention = serializeSnapshotRetention;

var _lodash = require("lodash");

var _time_serialization = require("./time_serialization");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function deserializeSnapshotDetails(repository, snapshotDetailsEs, managedRepository, successfulSnapshots) {
  if (!snapshotDetailsEs || typeof snapshotDetailsEs !== 'object') {
    throw new Error('Unable to deserialize snapshot details');
  }

  const {
    snapshot,
    uuid,
    version_id: versionId,
    version,
    indices = [],
    data_streams: dataStreams = [],
    include_global_state: includeGlobalState,
    state,
    start_time: startTime,
    start_time_in_millis: startTimeInMillis,
    end_time: endTime,
    end_time_in_millis: endTimeInMillis,
    duration_in_millis: durationInMillis,
    failures = [],
    shards,
    metadata: {
      policy: policyName
    } = {
      policy: undefined
    }
  } = snapshotDetailsEs; // If an index has multiple failures, we'll want to see them grouped together.

  const indexToFailuresMap = failures.reduce((map, failure) => {
    const {
      index,
      ...rest
    } = failure;

    if (!map[index]) {
      map[index] = {
        index,
        failures: []
      };
    }

    map[index].failures.push(rest);
    return map;
  }, {}); // Sort all failures by their shard.

  Object.keys(indexToFailuresMap).forEach(index => {
    indexToFailuresMap[index].failures = (0, _lodash.sortBy)(indexToFailuresMap[index].failures, ({
      shard
    }) => shard);
  }); // Sort by index name.

  const indexFailures = (0, _lodash.sortBy)(Object.values(indexToFailuresMap), ({
    index
  }) => index);
  const snapshotDetails = {
    repository,
    snapshot,
    uuid,
    versionId,
    version,
    indices: [...indices].sort(),
    dataStreams: [...dataStreams].sort(),
    includeGlobalState,
    state,
    startTime,
    startTimeInMillis,
    endTime,
    endTimeInMillis,
    durationInMillis,
    indexFailures,
    shards,
    managedRepository
  };

  if (successfulSnapshots && successfulSnapshots.length) {
    snapshotDetails.isLastSuccessfulSnapshot = successfulSnapshots[0].snapshot === snapshot;
  }

  if (policyName) {
    snapshotDetails.policyName = policyName;
  }

  return snapshotDetails;
}

function deserializeSnapshotConfig(snapshotConfigEs) {
  const {
    indices,
    ignore_unavailable: ignoreUnavailable,
    include_global_state: includeGlobalState,
    partial,
    metadata
  } = snapshotConfigEs;
  const snapshotConfig = {
    indices,
    ignoreUnavailable,
    includeGlobalState,
    partial,
    metadata
  };
  return Object.entries(snapshotConfig).reduce((config, [key, value]) => {
    if (value !== undefined) {
      config[key] = value;
    }

    return config;
  }, {});
}

function serializeSnapshotConfig(snapshotConfig) {
  const {
    indices,
    ignoreUnavailable,
    includeGlobalState,
    partial,
    metadata
  } = snapshotConfig;
  const maybeIndicesArray = (0, _utils.csvToArray)(indices);
  const snapshotConfigEs = {
    indices: maybeIndicesArray,
    ignore_unavailable: ignoreUnavailable,
    include_global_state: includeGlobalState,
    partial,
    metadata
  };
  return Object.entries(snapshotConfigEs).reduce((config, [key, value]) => {
    if (value !== undefined) {
      config[key] = value;
    }

    return config;
  }, {});
}

function deserializeSnapshotRetention(snapshotRetentionEs) {
  const {
    expire_after: expireAfter,
    max_count: maxCount,
    min_count: minCount
  } = snapshotRetentionEs;
  let expireAfterValue;
  let expireAfterUnit;

  if (expireAfter) {
    const {
      timeValue,
      timeUnit
    } = (0, _time_serialization.deserializeTime)(expireAfter);

    if (timeValue && timeUnit) {
      expireAfterValue = timeValue;
      expireAfterUnit = timeUnit;
    }
  }

  const snapshotRetention = {
    expireAfterValue,
    expireAfterUnit,
    maxCount,
    minCount
  };
  return Object.entries(snapshotRetention).reduce((retention, [key, value]) => {
    if (value !== undefined) {
      retention[key] = value;
    }

    return retention;
  }, {});
}

function serializeSnapshotRetention(snapshotRetention) {
  const {
    expireAfterValue,
    expireAfterUnit,
    minCount,
    maxCount
  } = snapshotRetention;
  const snapshotRetentionEs = {
    expire_after: expireAfterValue && expireAfterUnit ? (0, _time_serialization.serializeTime)(expireAfterValue, expireAfterUnit) : undefined,
    min_count: !minCount ? undefined : minCount,
    max_count: !maxCount ? undefined : maxCount
  };
  const flattenedSnapshotRetentionEs = Object.entries(snapshotRetentionEs).reduce((retention, [key, value]) => {
    if (value !== undefined) {
      retention[key] = value;
    }

    return retention;
  }, {});
  return Object.entries(flattenedSnapshotRetentionEs).length ? flattenedSnapshotRetentionEs : undefined;
}