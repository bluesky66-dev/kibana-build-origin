"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsageStatsClient = exports.RESOLVE_COPY_STATS_PREFIX = exports.COPY_STATS_PREFIX = void 0;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const COPY_STATS_PREFIX = 'apiCalls.copySavedObjects';
exports.COPY_STATS_PREFIX = COPY_STATS_PREFIX;
const RESOLVE_COPY_STATS_PREFIX = 'apiCalls.resolveCopySavedObjectsErrors';
exports.RESOLVE_COPY_STATS_PREFIX = RESOLVE_COPY_STATS_PREFIX;
const ALL_COUNTER_FIELDS = [`${COPY_STATS_PREFIX}.total`, `${COPY_STATS_PREFIX}.kibanaRequest.yes`, `${COPY_STATS_PREFIX}.kibanaRequest.no`, `${COPY_STATS_PREFIX}.createNewCopiesEnabled.yes`, `${COPY_STATS_PREFIX}.createNewCopiesEnabled.no`, `${COPY_STATS_PREFIX}.overwriteEnabled.yes`, `${COPY_STATS_PREFIX}.overwriteEnabled.no`, `${RESOLVE_COPY_STATS_PREFIX}.total`, `${RESOLVE_COPY_STATS_PREFIX}.kibanaRequest.yes`, `${RESOLVE_COPY_STATS_PREFIX}.kibanaRequest.no`, `${RESOLVE_COPY_STATS_PREFIX}.createNewCopiesEnabled.yes`, `${RESOLVE_COPY_STATS_PREFIX}.createNewCopiesEnabled.no`];

class UsageStatsClient {
  constructor(debugLogger, repositoryPromise) {
    this.debugLogger = debugLogger;
    this.repositoryPromise = repositoryPromise;
  }

  async getUsageStats() {
    this.debugLogger('getUsageStats() called');
    let usageStats = {};

    try {
      const repository = await this.repositoryPromise;
      const result = await repository.incrementCounter(_constants.SPACES_USAGE_STATS_TYPE, _constants.SPACES_USAGE_STATS_ID, ALL_COUNTER_FIELDS, {
        initialize: true
      });
      usageStats = result.attributes;
    } catch (err) {// do nothing
    }

    return usageStats;
  }

  async incrementCopySavedObjects({
    headers,
    createNewCopies,
    overwrite
  }) {
    const isKibanaRequest = getIsKibanaRequest(headers);
    const counterFieldNames = ['total', `kibanaRequest.${isKibanaRequest ? 'yes' : 'no'}`, `createNewCopiesEnabled.${createNewCopies ? 'yes' : 'no'}`, `overwriteEnabled.${overwrite ? 'yes' : 'no'}`];
    await this.updateUsageStats(counterFieldNames, COPY_STATS_PREFIX);
  }

  async incrementResolveCopySavedObjectsErrors({
    headers,
    createNewCopies
  }) {
    const isKibanaRequest = getIsKibanaRequest(headers);
    const counterFieldNames = ['total', `kibanaRequest.${isKibanaRequest ? 'yes' : 'no'}`, `createNewCopiesEnabled.${createNewCopies ? 'yes' : 'no'}`];
    await this.updateUsageStats(counterFieldNames, RESOLVE_COPY_STATS_PREFIX);
  }

  async updateUsageStats(counterFieldNames, prefix) {
    const options = {
      refresh: false
    };

    try {
      const repository = await this.repositoryPromise;
      await repository.incrementCounter(_constants.SPACES_USAGE_STATS_TYPE, _constants.SPACES_USAGE_STATS_ID, counterFieldNames.map(x => `${prefix}.${x}`), options);
    } catch (err) {// do nothing
    }
  }

}

exports.UsageStatsClient = UsageStatsClient;

function getIsKibanaRequest(headers) {
  // The presence of these two request headers gives us a good indication that this is a first-party request from the Kibana client.
  // We can't be 100% certain, but this is a reasonable attempt.
  return headers && headers['kbn-version'] && headers.referer;
}