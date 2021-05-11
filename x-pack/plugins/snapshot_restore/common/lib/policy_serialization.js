"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializePolicy = exports.deserializePolicy = void 0;

var _ = require("./");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deserializePolicy = (name, esPolicy, managedPolicies) => {
  const {
    version,
    modified_date: modifiedDate,
    modified_date_millis: modifiedDateMillis,
    policy: {
      name: snapshotName,
      schedule,
      repository,
      config,
      retention
    },
    next_execution: nextExecution,
    next_execution_millis: nextExecutionMillis,
    last_failure: lastFailure,
    last_success: lastSuccess,
    in_progress: inProgress,
    stats
  } = esPolicy;
  const policy = {
    name,
    version,
    modifiedDate,
    modifiedDateMillis,
    snapshotName,
    schedule,
    repository,
    nextExecution,
    nextExecutionMillis,
    isManagedPolicy: managedPolicies.includes(name)
  };

  if (config) {
    policy.config = (0, _.deserializeSnapshotConfig)(config);
  }

  if (retention) {
    policy.retention = (0, _.deserializeSnapshotRetention)(retention);
  }

  if (lastFailure) {
    const {
      snapshot_name: failureSnapshotName,
      time: failureTime,
      time_string: failureTimeString,
      details: failureDetails
    } = lastFailure;
    let jsonFailureDetails;

    try {
      jsonFailureDetails = JSON.parse(failureDetails);
    } catch (e) {// silently swallow json parsing error
      // we don't expect ES to return unparsable json
    }

    policy.lastFailure = {
      snapshotName: failureSnapshotName,
      time: failureTime,
      timeString: failureTimeString,
      details: jsonFailureDetails || failureDetails
    };
  }

  if (lastSuccess) {
    const {
      snapshot_name: successSnapshotName,
      time: successTime,
      time_string: successTimeString
    } = lastSuccess;
    policy.lastSuccess = {
      snapshotName: successSnapshotName,
      time: successTime,
      timeString: successTimeString
    };
  }

  if (inProgress) {
    const {
      name: inProgressSnapshotName
    } = inProgress;
    policy.inProgress = {
      snapshotName: inProgressSnapshotName
    };
  }

  if (stats) {
    const {
      snapshots_taken: snapshotsTaken,
      snapshots_failed: snapshotsFailed,
      snapshots_deleted: snapshotsDeleted,
      snapshot_deletion_failures: snapshotDeletionFailures
    } = stats;
    policy.stats = {
      snapshotsTaken,
      snapshotsFailed,
      snapshotsDeleted,
      snapshotDeletionFailures
    };
  }

  return policy;
};

exports.deserializePolicy = deserializePolicy;

const serializePolicy = policy => {
  const {
    snapshotName: name,
    schedule,
    repository,
    config,
    retention
  } = policy;
  const policyEs = {
    name,
    schedule,
    repository
  };

  if (config) {
    policyEs.config = (0, _.serializeSnapshotConfig)(config);
  }

  if (retention) {
    const serializedRetention = (0, _.serializeSnapshotRetention)(retention);

    if (serializedRetention) {
      policyEs.retention = (0, _.serializeSnapshotRetention)(retention);
    }
  }

  return policyEs;
};

exports.serializePolicy = serializePolicy;