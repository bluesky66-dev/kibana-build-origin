"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.healthRoute = healthRoute;
exports.withServiceStatus = withServiceStatus;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _lodash = require("lodash");

var _server = require("../../../../../src/core/server");

var _monitoring = require("../monitoring");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const LEVEL_SUMMARY = {
  [_server.ServiceStatusLevels.available.toString()]: 'Task Manager is healthy',
  [_server.ServiceStatusLevels.degraded.toString()]: 'Task Manager is unhealthy',
  [_server.ServiceStatusLevels.unavailable.toString()]: 'Task Manager is unavailable'
};

function healthRoute(router, monitoringStats$, logger, taskManagerId, config) {
  // if "hot" health stats are any more stale than monitored_stats_required_freshness (pollInterval +1s buffer by default)
  // consider the system unhealthy
  const requiredHotStatsFreshness = config.monitored_stats_required_freshness; // if "cold" health stats are any more stale than the configured refresh (+ a buffer), consider the system unhealthy

  const requiredColdStatsFreshness = config.monitored_aggregated_stats_refresh_rate * 1.5;

  function calculateStatus(monitoredStats) {
    const now = Date.now();
    const timestamp = new Date(now).toISOString();
    const summarizedStats = (0, _monitoring.summarizeMonitoringStats)(monitoredStats, config);
    /**
     * If the monitored stats aren't fresh, return a red status
     */

    const healthStatus = hasStatus(summarizedStats.stats, _monitoring.HealthStatus.Error) || hasExpiredHotTimestamps(summarizedStats, now, requiredHotStatsFreshness) || hasExpiredColdTimestamps(summarizedStats, now, requiredColdStatsFreshness) ? _monitoring.HealthStatus.Error : hasStatus(summarizedStats.stats, _monitoring.HealthStatus.Warning) ? _monitoring.HealthStatus.Warning : _monitoring.HealthStatus.OK;
    return {
      id: taskManagerId,
      timestamp,
      status: healthStatus,
      ...summarizedStats
    };
  }

  const serviceStatus$ = new _rxjs.Subject();
  /* keep track of last health summary, as we'll return that to the next call to _health */

  let lastMonitoredStats = null;
  /* Log Task Manager stats as a Debug log line at a fixed interval */

  monitoringStats$.pipe((0, _operators.throttleTime)(requiredHotStatsFreshness), (0, _operators.tap)(stats => {
    lastMonitoredStats = stats;
  }), // Only calculate the summerized stats (calculates all runnign averages and evaluates state)
  // when needed by throttling down to the requiredHotStatsFreshness
  (0, _operators.map)(stats => withServiceStatus(calculateStatus(stats)))).subscribe(([monitoredHealth, serviceStatus]) => {
    serviceStatus$.next(serviceStatus);
    logger.debug(`Latest Monitored Stats: ${JSON.stringify(monitoredHealth)}`);
  });
  router.get({
    path: '/api/task_manager/_health',
    validate: false
  }, async function (context, req, res) {
    return res.ok({
      body: lastMonitoredStats ? calculateStatus(lastMonitoredStats) : {
        id: taskManagerId,
        timestamp: new Date().toISOString(),
        status: _monitoring.HealthStatus.Error
      }
    });
  });
  return serviceStatus$;
}

function withServiceStatus(monitoredHealth) {
  const level = monitoredHealth.status === _monitoring.HealthStatus.OK ? _server.ServiceStatusLevels.available : monitoredHealth.status === _monitoring.HealthStatus.Warning ? _server.ServiceStatusLevels.degraded : _server.ServiceStatusLevels.unavailable;
  return [monitoredHealth, {
    level,
    summary: LEVEL_SUMMARY[level.toString()],
    meta: monitoredHealth
  }];
}
/**
 * If certain "hot" stats are not fresh, then the _health api will should return a Red status
 * @param monitoringStats The monitored stats
 * @param now The time to compare against
 * @param requiredFreshness How fresh should these stats be
 */


function hasExpiredHotTimestamps(monitoringStats, now, requiredFreshness) {
  var _monitoringStats$stat;

  return now - getOldestTimestamp(monitoringStats.last_update, (_monitoringStats$stat = monitoringStats.stats.runtime) === null || _monitoringStats$stat === void 0 ? void 0 : _monitoringStats$stat.value.polling.last_successful_poll) > requiredFreshness;
}

function hasExpiredColdTimestamps(monitoringStats, now, requiredFreshness) {
  var _monitoringStats$stat2;

  return now - getOldestTimestamp((_monitoringStats$stat2 = monitoringStats.stats.workload) === null || _monitoringStats$stat2 === void 0 ? void 0 : _monitoringStats$stat2.timestamp) > requiredFreshness;
}

function hasStatus(stats, status) {
  return Object.values(stats).map(stat => (stat === null || stat === void 0 ? void 0 : stat.status) === status).includes(true);
}

function getOldestTimestamp(...timestamps) {
  const validTimestamps = timestamps.map(timestamp => (0, _lodash.isString)(timestamp) ? Date.parse(timestamp) : NaN).filter(timestamp => !isNaN(timestamp));
  return validTimestamps.length ? Math.min(...validTimestamps) : 0;
}