"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUsageCollector = registerUsageCollector;

var _fetch = require("./fetch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function registerUsageCollector(usageCollection, context, logger) {
  try {
    const collector = usageCollection.makeUsageCollector({
      type: 'search-session',
      isReady: () => true,
      fetch: (0, _fetch.fetchProvider)(context.config.legacy.globalConfig$, logger),
      schema: {
        transientCount: {
          type: 'long'
        },
        persistedCount: {
          type: 'long'
        },
        totalCount: {
          type: 'long'
        }
      }
    });
    usageCollection.registerCollector(collector);
  } catch (err) {
    return; // kibana plugin is not enabled (test environment)
  }
}