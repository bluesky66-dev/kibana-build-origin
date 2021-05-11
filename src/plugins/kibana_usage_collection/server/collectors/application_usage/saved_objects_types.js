"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMappings = registerMappings;
exports.SAVED_OBJECTS_DAILY_TYPE = exports.SAVED_OBJECTS_TRANSACTIONAL_TYPE = exports.SAVED_OBJECTS_TOTAL_TYPE = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Used for accumulating the totals of all the stats older than 90d
 */
const SAVED_OBJECTS_TOTAL_TYPE = 'application_usage_totals';
/**
 * Used for storing each of the reports received from the users' browsers
 */

exports.SAVED_OBJECTS_TOTAL_TYPE = SAVED_OBJECTS_TOTAL_TYPE;
const SAVED_OBJECTS_TRANSACTIONAL_TYPE = 'application_usage_transactional';
/**
 * Used to aggregate the transactional events into daily summaries so we can purge the granular events
 */

exports.SAVED_OBJECTS_TRANSACTIONAL_TYPE = SAVED_OBJECTS_TRANSACTIONAL_TYPE;
const SAVED_OBJECTS_DAILY_TYPE = 'application_usage_daily';
exports.SAVED_OBJECTS_DAILY_TYPE = SAVED_OBJECTS_DAILY_TYPE;

function registerMappings(registerType) {
  // Type for storing ApplicationUsageTotal
  registerType({
    name: SAVED_OBJECTS_TOTAL_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    mappings: {
      // Not indexing any of its contents because we use them "as-is" and don't search by these fields
      // for more info, see the README.md for application_usage
      dynamic: false,
      properties: {}
    }
  }); // Type for storing ApplicationUsageDaily

  registerType({
    name: SAVED_OBJECTS_DAILY_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    mappings: {
      dynamic: false,
      properties: {
        // This type requires `timestamp` to be indexed so we can use it when rolling up totals (timestamp < now-90d)
        timestamp: {
          type: 'date'
        }
      }
    }
  }); // Type for storing ApplicationUsageTransactional (declaring empty mappings because we don't use the internal fields for query/aggregations)

  registerType({
    name: SAVED_OBJECTS_TRANSACTIONAL_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    mappings: {
      dynamic: false,
      properties: {}
    }
  });
}