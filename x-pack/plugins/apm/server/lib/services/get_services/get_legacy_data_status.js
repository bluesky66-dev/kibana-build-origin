"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLegacyDataStatus = getLegacyDataStatus;

var _processor_event = require("../../../../common/processor_event");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// returns true if 6.x data is found


async function getLegacyDataStatus(setup) {
  return (0, _with_apm_span.withApmSpan)('get_legacy_data_status', async () => {
    const {
      apmEventClient
    } = setup;
    const params = {
      terminateAfter: 1,
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: [{
              range: {
                [_elasticsearch_fieldnames.OBSERVER_VERSION_MAJOR]: {
                  lt: 7
                }
              }
            }]
          }
        }
      }
    };
    const resp = await apmEventClient.search(params, {
      includeLegacyData: true
    });
    const hasLegacyData = resp.hits.total.value > 0;
    return hasLegacyData;
  });
}