"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeSampleDataUsageCollector = makeSampleDataUsageCollector;

var _operators = require("rxjs/operators");

var _collector_fetch = require("./collector_fetch");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function makeSampleDataUsageCollector(usageCollection, context) {
  let index;

  try {
    const config = await context.config.legacy.globalConfig$.pipe((0, _operators.first)()).toPromise();
    index = config.kibana.index;
  } catch (err) {
    return; // kibana plugin is not enabled (test environment)
  }

  const collector = usageCollection.makeUsageCollector({
    type: 'sample-data',
    fetch: (0, _collector_fetch.fetchProvider)(index),
    isReady: () => true,
    schema: {
      installed: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      },
      last_install_date: {
        type: 'date'
      },
      last_install_set: {
        type: 'keyword'
      },
      last_uninstall_date: {
        type: 'date'
      },
      last_uninstall_set: {
        type: 'keyword'
      },
      uninstalled: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      }
    }
  });
  usageCollection.registerCollector(collector);
}