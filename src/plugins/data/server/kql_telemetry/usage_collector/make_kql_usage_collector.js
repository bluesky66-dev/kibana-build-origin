"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeKQLUsageCollector = makeKQLUsageCollector;

var _fetch = require("./fetch");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function makeKQLUsageCollector(usageCollection, kibanaIndex) {
  const kqlUsageCollector = usageCollection.makeUsageCollector({
    type: 'kql',
    fetch: (0, _fetch.fetchProvider)(kibanaIndex),
    isReady: () => true,
    schema: {
      optInCount: {
        type: 'long'
      },
      optOutCount: {
        type: 'long'
      },
      defaultQueryLanguage: {
        type: 'keyword'
      }
    }
  });
  usageCollection.registerCollector(kqlUsageCollector);
}