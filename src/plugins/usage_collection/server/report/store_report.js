"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeReport = storeReport;

var _moment = _interopRequireDefault(require("moment"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function storeReport(internalRepository, report) {
  const uiCounters = report.uiCounter ? Object.entries(report.uiCounter) : [];
  const userAgents = report.userAgent ? Object.entries(report.userAgent) : [];
  const appUsage = report.application_usage ? Object.values(report.application_usage) : [];
  const momentTimestamp = (0, _moment.default)();
  const timestamp = momentTimestamp.toDate();
  const date = momentTimestamp.format('DDMMYYYY');
  return Promise.allSettled([// User Agent
  ...userAgents.map(async ([key, metric]) => {
    const {
      userAgent
    } = metric;
    const savedObjectId = `${key}:${userAgent}`;
    return await internalRepository.create('ui-metric', {
      count: 1
    }, {
      id: savedObjectId,
      overwrite: true
    });
  }), // Deprecated UI metrics, Use data from UI Counters.
  ...(0, _lodash.chain)(report.uiCounter).groupBy(e => `${e.appName}:${e.eventName}`).entries().map(([savedObjectId, metric]) => {
    return {
      savedObjectId,
      incrementBy: (0, _lodash.sumBy)(metric, 'total')
    };
  }).map(async ({
    savedObjectId,
    incrementBy
  }) => {
    return await internalRepository.incrementCounter('ui-metric', savedObjectId, [{
      fieldName: 'count',
      incrementBy
    }]);
  }).value(), // UI Counters
  ...uiCounters.map(async ([key, metric]) => {
    const {
      appName,
      eventName,
      total,
      type
    } = metric;
    const savedObjectId = `${appName}:${date}:${type}:${eventName}`;
    return [await internalRepository.incrementCounter('ui-counter', savedObjectId, [{
      fieldName: 'count',
      incrementBy: total
    }])];
  }), // Application Usage
  ...[(async () => {
    if (!appUsage.length) return [];
    const {
      saved_objects: savedObjects
    } = await internalRepository.bulkCreate(appUsage.map(metric => ({
      type: 'application_usage_transactional',
      attributes: { ...metric,
        timestamp
      }
    })));
    return savedObjects;
  })()]]);
}