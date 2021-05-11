"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerApplicationUsageCollector = registerApplicationUsageCollector;
exports.transformByApplicationViews = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _rxjs = require("rxjs");

var _constants = require("../../../../usage_collection/common/constants");

var _rollups = require("./rollups");

var _saved_objects_types = require("./saved_objects_types");

var _schema = require("./schema");

var _constants2 = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const transformByApplicationViews = report => {
  const reportMetrics = Object.values(report);
  const mainApplications = reportMetrics.filter(appView => appView.viewId === _constants.MAIN_APP_DEFAULT_VIEW_ID);
  const appViews = reportMetrics.filter(appView => appView.viewId !== _constants.MAIN_APP_DEFAULT_VIEW_ID);
  return mainApplications.reduce((acc, mainApplication) => {
    const currentAppViews = appViews.filter(appView => appView.appId === mainApplication.appId);
    acc[mainApplication.appId] = { ...mainApplication,
      views: currentAppViews
    };
    return acc;
  }, {});
};

exports.transformByApplicationViews = transformByApplicationViews;

function registerApplicationUsageCollector(logger, usageCollection, registerType, getSavedObjectsClient) {
  (0, _saved_objects_types.registerMappings)(registerType);
  const collector = usageCollection.makeUsageCollector({
    type: 'application_usage',
    isReady: () => typeof getSavedObjectsClient() !== 'undefined',
    schema: _schema.applicationUsageSchema,
    fetch: async () => {
      const savedObjectsClient = getSavedObjectsClient();

      if (typeof savedObjectsClient === 'undefined') {
        return;
      }

      const [{
        saved_objects: rawApplicationUsageTotals
      }, {
        saved_objects: rawApplicationUsageDaily
      }, {
        saved_objects: rawApplicationUsageTransactional
      }] = await Promise.all([savedObjectsClient.find({
        type: _saved_objects_types.SAVED_OBJECTS_TOTAL_TYPE,
        perPage: 10000 // We only have 44 apps for now. This limit is OK.

      }), savedObjectsClient.find({
        type: _saved_objects_types.SAVED_OBJECTS_DAILY_TYPE,
        perPage: 10000 // We can have up to 44 apps * 91 days = 4004 docs. This limit is OK

      }), savedObjectsClient.find({
        type: _saved_objects_types.SAVED_OBJECTS_TRANSACTIONAL_TYPE,
        perPage: 10000 // If we have more than those, we won't report the rest (they'll be rolled up to the daily soon enough to become a problem)

      })]);
      const applicationUsageFromTotals = rawApplicationUsageTotals.reduce((acc, {
        attributes: {
          appId,
          viewId = _constants.MAIN_APP_DEFAULT_VIEW_ID,
          minutesOnScreen,
          numberOfClicks
        }
      }) => {
        const existing = acc[appId] || {
          clicks_total: 0,
          minutes_on_screen_total: 0
        };
        return { ...acc,
          [(0, _rollups.serializeKey)(appId, viewId)]: {
            appId,
            viewId,
            clicks_total: numberOfClicks + existing.clicks_total,
            clicks_7_days: 0,
            clicks_30_days: 0,
            clicks_90_days: 0,
            minutes_on_screen_total: minutesOnScreen + existing.minutes_on_screen_total,
            minutes_on_screen_7_days: 0,
            minutes_on_screen_30_days: 0,
            minutes_on_screen_90_days: 0
          }
        };
      }, {});
      const nowMinus7 = (0, _moment.default)().subtract(7, 'days');
      const nowMinus30 = (0, _moment.default)().subtract(30, 'days');
      const nowMinus90 = (0, _moment.default)().subtract(90, 'days');
      const applicationUsage = [...rawApplicationUsageDaily, ...rawApplicationUsageTransactional].reduce((acc, {
        attributes: {
          appId,
          viewId = _constants.MAIN_APP_DEFAULT_VIEW_ID,
          minutesOnScreen,
          numberOfClicks,
          timestamp
        }
      }) => {
        const existing = acc[(0, _rollups.serializeKey)(appId, viewId)] || {
          appId,
          viewId,
          clicks_total: 0,
          clicks_7_days: 0,
          clicks_30_days: 0,
          clicks_90_days: 0,
          minutes_on_screen_total: 0,
          minutes_on_screen_7_days: 0,
          minutes_on_screen_30_days: 0,
          minutes_on_screen_90_days: 0
        };
        const timeOfEntry = (0, _moment.default)(timestamp);
        const isInLast7Days = timeOfEntry.isSameOrAfter(nowMinus7);
        const isInLast30Days = timeOfEntry.isSameOrAfter(nowMinus30);
        const isInLast90Days = timeOfEntry.isSameOrAfter(nowMinus90);
        const last7Days = {
          clicks_7_days: existing.clicks_7_days + numberOfClicks,
          minutes_on_screen_7_days: existing.minutes_on_screen_7_days + minutesOnScreen
        };
        const last30Days = {
          clicks_30_days: existing.clicks_30_days + numberOfClicks,
          minutes_on_screen_30_days: existing.minutes_on_screen_30_days + minutesOnScreen
        };
        const last90Days = {
          clicks_90_days: existing.clicks_90_days + numberOfClicks,
          minutes_on_screen_90_days: existing.minutes_on_screen_90_days + minutesOnScreen
        };
        return { ...acc,
          [(0, _rollups.serializeKey)(appId, viewId)]: { ...existing,
            clicks_total: existing.clicks_total + numberOfClicks,
            minutes_on_screen_total: existing.minutes_on_screen_total + minutesOnScreen,
            ...(isInLast7Days ? last7Days : {}),
            ...(isInLast30Days ? last30Days : {}),
            ...(isInLast90Days ? last90Days : {})
          }
        };
      }, applicationUsageFromTotals);
      return transformByApplicationViews(applicationUsage);
    }
  });
  usageCollection.registerCollector(collector);
  (0, _rxjs.timer)(_constants2.ROLL_INDICES_START, _constants2.ROLL_DAILY_INDICES_INTERVAL).subscribe(() => (0, _rollups.rollDailyData)(logger, getSavedObjectsClient()));
  (0, _rxjs.timer)(_constants2.ROLL_INDICES_START, _constants2.ROLL_TOTAL_INDICES_INTERVAL).subscribe(() => (0, _rollups.rollTotals)(logger, getSavedObjectsClient()));
}