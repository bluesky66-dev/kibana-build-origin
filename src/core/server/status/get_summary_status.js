"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSummaryStatus = void 0;

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Returns a single {@link ServiceStatus} that summarizes the most severe status level from a group of statuses.
 * @param statuses
 */
const getSummaryStatus = (statuses, {
  allAvailableSummary = `All services are available`
} = {}) => {
  const {
    highestLevel,
    highestStatuses
  } = highestLevelSummary(statuses);

  if (highestLevel === _types.ServiceStatusLevels.available) {
    return {
      level: _types.ServiceStatusLevels.available,
      summary: allAvailableSummary
    };
  } else if (highestStatuses.length === 1) {
    var _status$detail;

    const [serviceName, status] = highestStatuses[0];
    return { ...status,
      summary: `[${serviceName}]: ${status.summary}`,
      // TODO: include URL to status page
      detail: (_status$detail = status.detail) !== null && _status$detail !== void 0 ? _status$detail : `See the status page for more information`,
      meta: {
        affectedServices: {
          [serviceName]: status
        }
      }
    };
  } else {
    return {
      level: highestLevel,
      summary: `[${highestStatuses.length}] services are ${highestLevel.toString()}`,
      // TODO: include URL to status page
      detail: `See the status page for more information`,
      meta: {
        affectedServices: Object.fromEntries(highestStatuses)
      }
    };
  }
};

exports.getSummaryStatus = getSummaryStatus;

const highestLevelSummary = statuses => {
  let highestLevel = _types.ServiceStatusLevels.available;
  let highestStatuses = [];

  for (const pair of statuses) {
    if (pair[1].level === highestLevel) {
      highestStatuses.push(pair);
    } else if (pair[1].level > highestLevel) {
      highestLevel = pair[1].level;
      highestStatuses = [pair];
    }
  }

  return {
    highestLevel,
    highestStatuses
  };
};