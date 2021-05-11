"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findExactConfiguration = findExactConfiguration;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _with_apm_span = require("../../../utils/with_apm_span");

var _convert_settings_to_string = require("./convert_settings_to_string");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function findExactConfiguration({
  service,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('find_exact_agent_configuration', async () => {
    const {
      internalClient,
      indices
    } = setup;
    const serviceNameFilter = service.name ? {
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: service.name
      }
    } : {
      bool: {
        must_not: [{
          exists: {
            field: _elasticsearch_fieldnames.SERVICE_NAME
          }
        }]
      }
    };
    const environmentFilter = service.environment ? {
      term: {
        [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: service.environment
      }
    } : {
      bool: {
        must_not: [{
          exists: {
            field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
          }
        }]
      }
    };
    const params = {
      index: indices.apmAgentConfigurationIndex,
      body: {
        query: {
          bool: {
            filter: [serviceNameFilter, environmentFilter]
          }
        }
      }
    };
    const resp = await internalClient.search(params);
    const hit = resp.hits.hits[0];

    if (!hit) {
      return;
    }

    return (0, _convert_settings_to_string.convertConfigSettingsToString)(hit);
  });
}