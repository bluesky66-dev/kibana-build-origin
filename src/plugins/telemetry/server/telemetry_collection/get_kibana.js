"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleKibanaStats = handleKibanaStats;
exports.getKibana = getKibana;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function handleKibanaStats({
  logger,
  version: serverVersion
}, response) {
  if (!response) {
    logger.warn('No Kibana stats returned from usage collectors');
    return;
  }

  const {
    kibana,
    kibana_stats: kibanaStats,
    ...plugins
  } = response;
  const os = {
    platform: 'unknown',
    platformRelease: 'unknown',
    ...kibanaStats.os
  };
  const formattedOsStats = Object.entries(os).reduce((acc, [key, value]) => {
    if (typeof value !== 'string') {
      // There are new fields reported now from the "os" property like "load", "memory", etc. They are objects.
      return acc;
    }

    return { ...acc,
      [`${key}s`]: [{
        [key]: value,
        count: 1
      }]
    };
  }, {});
  const version = serverVersion.replace(/-snapshot/i, ''); // Shouldn't we better maintain the -snapshot so we can differentiate between actual final releases and snapshots?
  // combine core stats (os types, saved objects) with plugin usage stats
  // organize the object into the same format as monitoring-enabled telemetry

  return { ...(0, _lodash.omit)(kibana, 'index'),
    // discard index
    count: 1,
    indices: 1,
    os: formattedOsStats,
    versions: [{
      version,
      count: 1
    }],
    plugins
  };
}

async function getKibana(usageCollection, asInternalUser, soClient, kibanaRequest) {
  const usage = await usageCollection.bulkFetch(asInternalUser, soClient, kibanaRequest);
  return usageCollection.toObject(usage);
}