"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsageStatsService = void 0;

var _usage_stats_client = require("./usage_stats_client");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class UsageStatsService {
  constructor(log) {
    this.log = log;
  }

  async setup({
    getStartServices
  }) {
    const internalRepositoryPromise = getStartServices().then(([coreStart]) => coreStart.savedObjects.createInternalRepository([_constants.SPACES_USAGE_STATS_TYPE]));

    const getClient = () => {
      const debugLogger = message => this.log.debug(message);

      return new _usage_stats_client.UsageStatsClient(debugLogger, internalRepositoryPromise);
    };

    return {
      getClient
    };
  }

  async stop() {}

}

exports.UsageStatsService = UsageStatsService;