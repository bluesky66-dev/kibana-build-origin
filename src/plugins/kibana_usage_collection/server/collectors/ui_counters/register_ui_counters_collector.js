"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformRawCounter = transformRawCounter;
exports.registerUiCountersUsageCollector = registerUiCountersUsageCollector;

var _moment = _interopRequireDefault(require("moment"));

var _ui_counter_saved_object_type = require("./ui_counter_saved_object_type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function transformRawCounter(rawUiCounter) {
  const {
    id,
    attributes,
    updated_at: lastUpdatedAt
  } = rawUiCounter;
  const [appName,, counterType, ...restId] = id.split(':');
  const eventName = restId.join(':');
  const counterTotal = attributes.count;
  const total = typeof counterTotal === 'number' ? counterTotal : 0;
  const fromTimestamp = (0, _moment.default)(lastUpdatedAt).utc().startOf('day').format();
  return {
    appName,
    eventName,
    lastUpdatedAt,
    fromTimestamp,
    counterType,
    total
  };
}

function registerUiCountersUsageCollector(usageCollection) {
  const collector = usageCollection.makeUsageCollector({
    type: 'ui_counters',
    schema: {
      dailyEvents: {
        type: 'array',
        items: {
          appName: {
            type: 'keyword'
          },
          eventName: {
            type: 'keyword'
          },
          lastUpdatedAt: {
            type: 'date'
          },
          fromTimestamp: {
            type: 'date'
          },
          counterType: {
            type: 'keyword'
          },
          total: {
            type: 'integer'
          }
        }
      }
    },
    fetch: async ({
      soClient
    }) => {
      const {
        saved_objects: rawUiCounters
      } = await soClient.find({
        type: _ui_counter_saved_object_type.UI_COUNTER_SAVED_OBJECT_TYPE,
        fields: ['count'],
        perPage: 10000
      });
      return {
        dailyEvents: rawUiCounters.reduce((acc, raw) => {
          try {
            const aggEvent = transformRawCounter(raw);
            acc.push(aggEvent);
          } catch (_) {// swallow error; allows sending successfully transformed objects.
          }

          return acc;
        }, [])
      };
    },
    isReady: () => true
  });
  usageCollection.registerCollector(collector);
}