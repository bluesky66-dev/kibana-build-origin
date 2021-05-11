"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUsageCollector = registerUsageCollector;

var _fetch = require("./fetch");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function registerUsageCollector(usageCollection, context) {
  try {
    const collector = usageCollection.makeUsageCollector({
      type: 'search',
      isReady: () => true,
      fetch: (0, _fetch.fetchProvider)(context.config.legacy.globalConfig$),
      schema: {
        successCount: {
          type: 'long'
        },
        errorCount: {
          type: 'long'
        },
        averageDuration: {
          type: 'float'
        }
      }
    });
    usageCollection.registerCollector(collector);
  } catch (err) {
    return; // kibana plugin is not enabled (test environment)
  }
}