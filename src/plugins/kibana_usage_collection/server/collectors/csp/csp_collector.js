"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCspCollector = createCspCollector;
exports.registerCspCollector = registerCspCollector;

var _server = require("../../../../../core/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createCspCollector(http) {
  return {
    type: 'csp',
    isReady: () => true,

    async fetch() {
      const {
        strict,
        warnLegacyBrowsers,
        header
      } = http.csp;
      return {
        strict,
        warnLegacyBrowsers,
        // It's important that we do not send the value of csp.header here as it
        // can be customized with values that can be identifiable to given
        // installs, such as URLs
        rulesChangedFromDefault: header !== _server.CspConfig.DEFAULT.header
      };
    },

    schema: {
      strict: {
        type: 'boolean'
      },
      warnLegacyBrowsers: {
        type: 'boolean'
      },
      rulesChangedFromDefault: {
        type: 'boolean'
      }
    }
  };
}

function registerCspCollector(usageCollection, http) {
  const collectorOptions = createCspCollector(http);
  const collector = usageCollection.makeUsageCollector(collectorOptions);
  usageCollection.registerCollector(collector);
}