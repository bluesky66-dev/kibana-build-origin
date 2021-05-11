"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateStatus$ = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _status = require("../status");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const calculateStatus$ = (rawMigratorStatus$, elasticsearchStatus$) => {
  const migratorStatus$ = rawMigratorStatus$.pipe((0, _operators.map)(migrationStatus => {
    if (migrationStatus.status === 'waiting') {
      return {
        level: _status.ServiceStatusLevels.unavailable,
        summary: `SavedObjects service is waiting to start migrations`
      };
    } else if (migrationStatus.status === 'running') {
      return {
        level: _status.ServiceStatusLevels.unavailable,
        summary: `SavedObjects service is running migrations`
      };
    }

    const statusCounts = {
      migrated: 0,
      skipped: 0
    };

    if (migrationStatus.result) {
      migrationStatus.result.forEach(({
        status
      }) => {
        var _statusCounts$status;

        statusCounts[status] = ((_statusCounts$status = statusCounts[status]) !== null && _statusCounts$status !== void 0 ? _statusCounts$status : 0) + 1;
      });
    }

    return {
      level: _status.ServiceStatusLevels.available,
      summary: `SavedObjects service has completed migrations and is available`,
      meta: {
        migratedIndices: statusCounts
      }
    };
  }), (0, _operators.startWith)({
    level: _status.ServiceStatusLevels.unavailable,
    summary: `SavedObjects service is waiting to start migrations`
  }));
  return (0, _rxjs.combineLatest)([elasticsearchStatus$, migratorStatus$]).pipe((0, _operators.map)(([esStatus, migratorStatus]) => {
    if (esStatus.level >= _status.ServiceStatusLevels.unavailable) {
      return {
        level: _status.ServiceStatusLevels.unavailable,
        summary: `SavedObjects service is not available without a healthy Elasticearch connection`
      };
    } else if (migratorStatus.level === _status.ServiceStatusLevels.unavailable) {
      return migratorStatus;
    } else if (esStatus.level === _status.ServiceStatusLevels.degraded) {
      return {
        level: esStatus.level,
        summary: `SavedObjects service is degraded due to Elasticsearch: [${esStatus.summary}]`
      };
    } else {
      return migratorStatus;
    }
  }));
};

exports.calculateStatus$ = calculateStatus$;