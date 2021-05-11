"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchConfigurations = searchConfigurations;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _convert_settings_to_string = require("./convert_settings_to_string");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function searchConfigurations({
  service,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('search_agent_configurations', async () => {
    const {
      internalClient,
      indices
    } = setup; // In the following `constant_score` is being used to disable IDF calculation (where frequency of a term influences scoring).
    // Additionally a boost has been added to service.name to ensure it scores higher.
    // If there is tie between a config with a matching service.name and a config with a matching environment, the config that matches service.name wins

    const serviceNameFilter = service.name ? [{
      constant_score: {
        filter: {
          term: {
            [_elasticsearch_fieldnames.SERVICE_NAME]: service.name
          }
        },
        boost: 2
      }
    }] : [];
    const environmentFilter = service.environment ? [{
      constant_score: {
        filter: {
          term: {
            [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: service.environment
          }
        },
        boost: 1
      }
    }] : [];
    const params = {
      index: indices.apmAgentConfigurationIndex,
      body: {
        query: {
          bool: {
            minimum_should_match: 2,
            should: [...serviceNameFilter, ...environmentFilter, {
              bool: {
                must_not: [{
                  exists: {
                    field: _elasticsearch_fieldnames.SERVICE_NAME
                  }
                }]
              }
            }, {
              bool: {
                must_not: [{
                  exists: {
                    field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
                  }
                }]
              }
            }]
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