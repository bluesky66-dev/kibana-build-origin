"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUpgradeAssistantStatus = getUpgradeAssistantStatus;

var _apm = require("./apm");

var _reindexing = require("./reindexing");

var _es_indices_state_check = require("./es_indices_state_check");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getUpgradeAssistantStatus(dataClient, isCloudEnabled, apmIndices) {
  const [{
    body: deprecations
  }, apmIndexDeprecations] = await Promise.all([dataClient.asCurrentUser.migration.deprecations(), (0, _apm.getDeprecatedApmIndices)(dataClient, apmIndices)]);
  const cluster = getClusterDeprecations(deprecations, isCloudEnabled);
  const indices = getCombinedIndexInfos(deprecations, apmIndexDeprecations);
  const indexNames = indices.map(({
    index
  }) => index); // If we have found deprecation information for index/indices check whether the index is
  // open or closed.

  if (indexNames.length) {
    const indexStates = await (0, _es_indices_state_check.esIndicesStateCheck)(dataClient.asCurrentUser, indexNames);
    indices.forEach(indexData => {
      indexData.blockerForReindexing = indexStates[indexData.index] === 'closed' ? 'index-closed' : undefined;
    });
  }

  const criticalWarnings = cluster.concat(indices).filter(d => d.level === 'critical');
  return {
    readyForUpgrade: criticalWarnings.length === 0,
    cluster,
    indices
  };
} // Reformats the index deprecations to an array of deprecation warnings extended with an index field.


const getCombinedIndexInfos = (deprecations, apmIndexDeprecations) => {
  const apmIndices = apmIndexDeprecations.reduce((acc, dep) => acc.add(dep.index), new Set());
  return Object.keys(deprecations.index_settings) // prevent APM indices from showing up for general re-indexing
  .filter(indexName => !apmIndices.has(indexName)).reduce((indexDeprecations, indexName) => {
    return indexDeprecations.concat(deprecations.index_settings[indexName].map(d => ({ ...d,
      index: indexName,
      reindex: /Index created before/.test(d.message) && !apmIndices.has(indexName),
      needsDefaultFields: /Number of fields exceeds automatic field expansion limit/.test(d.message)
    })));
  }, []) // Filter out warnings for system indices until we know more about what changes are required for the
  // next upgrade in a future minor version. Note, we're still including APM depercations below.
  .filter(deprecation => !(0, _reindexing.isSystemIndex)(deprecation.index)).concat(apmIndexDeprecations);
};

const getClusterDeprecations = (deprecations, isCloudEnabled) => {
  const combined = deprecations.cluster_settings.concat(deprecations.ml_settings).concat(deprecations.node_settings);

  if (isCloudEnabled) {
    // In Cloud, this is changed at upgrade time. Filter it out to improve upgrade UX.
    return combined.filter(d => d.message !== 'Security realm settings structure changed');
  } else {
    return combined;
  }
};