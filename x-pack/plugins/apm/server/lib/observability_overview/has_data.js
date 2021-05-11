"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasData = hasData;

var _processor_event = require("../../../common/processor_event");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function hasData({
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('observability_overview_has_apm_data', async () => {
    const {
      apmEventClient
    } = setup;

    try {
      const params = {
        apm: {
          events: [_processor_event.ProcessorEvent.transaction, _processor_event.ProcessorEvent.error, _processor_event.ProcessorEvent.metric]
        },
        terminateAfter: 1,
        body: {
          size: 0
        }
      };
      const response = await apmEventClient.search(params);
      return response.hits.total.value > 0;
    } catch (e) {
      return false;
    }
  });
}