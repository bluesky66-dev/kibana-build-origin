"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStaticIndexPattern = createStaticIndexPattern;

var _server = require("../../../../../../src/core/server");

var _server2 = require("../../../../../../src/plugins/apm_oss/server");

var _has_historical_agent_data = require("../services/get_services/has_historical_agent_data");

var _with_apm_span = require("../../utils/with_apm_span");

var _get_apm_index_pattern_title = require("./get_apm_index_pattern_title");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function createStaticIndexPattern(setup, context, savedObjectsClient) {
  return (0, _with_apm_span.withApmSpan)('create_static_index_pattern', async () => {
    const {
      config
    } = context; // don't autocreate APM index pattern if it's been disabled via the config

    if (!config['xpack.apm.autocreateApmIndexPattern']) {
      return;
    } // Discover and other apps will throw errors if an index pattern exists without having matching indices.
    // The following ensures the index pattern is only created if APM data is found


    const hasData = await (0, _has_historical_agent_data.hasHistoricalAgentData)(setup);

    if (!hasData) {
      return;
    }

    try {
      const apmIndexPatternTitle = (0, _get_apm_index_pattern_title.getApmIndexPatternTitle)(context);
      await (0, _with_apm_span.withApmSpan)('create_index_pattern_saved_object', () => savedObjectsClient.create('index-pattern', { ..._server2.apmIndexPattern.attributes,
        title: apmIndexPatternTitle
      }, {
        id: _server2.APM_STATIC_INDEX_PATTERN_ID,
        overwrite: false
      }));
      return;
    } catch (e) {
      // if the index pattern (saved object) already exists a conflict error (code: 409) will be thrown
      // that error should be silenced
      if (_server.SavedObjectsErrorHelpers.isConflictError(e)) {
        return;
      }

      throw e;
    }
  });
}