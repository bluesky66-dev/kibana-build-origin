"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REDACTED_KEYWORD = exports.KIBANA_STATS_TYPE = exports.PLUGIN_NAME = exports.PLUGIN_ID = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const PLUGIN_ID = 'kibanaUsageCollection';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'kibana_usage_collection';
/**
 * The type name used to publish Kibana usage stats in the formatted as bulk.
 */

exports.PLUGIN_NAME = PLUGIN_NAME;
const KIBANA_STATS_TYPE = 'kibana_stats';
/**
 * Redacted keyword; used as a value for sensitive ui settings
 */

exports.KIBANA_STATS_TYPE = KIBANA_STATS_TYPE;
const REDACTED_KEYWORD = '[REDACTED]';
exports.REDACTED_KEYWORD = REDACTED_KEYWORD;