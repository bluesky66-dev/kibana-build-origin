"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rollupServiceProvider = rollupServiceProvider;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function rollupServiceProvider(indexPattern, {
  asCurrentUser
}, savedObjectsClient) {
  const rollupIndexPatternObject = await loadRollupIndexPattern(indexPattern, savedObjectsClient);
  let jobIndexPatterns = [indexPattern];

  async function getRollupJobs() {
    if (rollupIndexPatternObject !== null) {
      const parsedTypeMetaData = JSON.parse(rollupIndexPatternObject.attributes.typeMeta);
      const rollUpIndex = parsedTypeMetaData.params.rollup_index;
      const {
        body: rollupCaps
      } = await asCurrentUser.rollup.getRollupIndexCaps({
        index: rollUpIndex
      });
      const indexRollupCaps = rollupCaps[rollUpIndex];

      if (indexRollupCaps && indexRollupCaps.rollup_jobs) {
        jobIndexPatterns = indexRollupCaps.rollup_jobs.map(j => j.index_pattern);
        return indexRollupCaps.rollup_jobs;
      }
    }

    return null;
  }

  function getIndexPattern() {
    return jobIndexPatterns.join(',');
  }

  return {
    getRollupJobs,
    getIndexPattern
  };
}

async function loadRollupIndexPattern(indexPattern, savedObjectsClient) {
  const resp = await savedObjectsClient.find({
    type: 'index-pattern',
    fields: ['title', 'type', 'typeMeta'],
    perPage: 1000
  });
  const obj = resp.saved_objects.find(r => r.attributes && r.attributes.type === 'rollup' && r.attributes.title === indexPattern && r.attributes.typeMeta !== undefined);
  return obj || null;
}