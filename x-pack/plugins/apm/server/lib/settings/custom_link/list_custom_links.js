"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listCustomLinks = listCustomLinks;

var _helper = require("./helper");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function listCustomLinks({
  setup,
  filters = {}
}) {
  return (0, _with_apm_span.withApmSpan)('list_custom_links', async () => {
    const {
      internalClient,
      indices
    } = setup;
    const esFilters = Object.entries(filters).map(([key, value]) => {
      return {
        bool: {
          minimum_should_match: 1,
          should: [{
            term: {
              [key]: value
            }
          }, {
            bool: {
              must_not: [{
                exists: {
                  field: key
                }
              }]
            }
          }]
        }
      };
    });
    const params = {
      index: indices.apmCustomLinkIndex,
      size: 500,
      body: {
        query: {
          bool: {
            filter: esFilters
          }
        },
        sort: [{
          'label.keyword': {
            order: 'asc'
          }
        }]
      }
    };
    const resp = await internalClient.search(params);
    const customLinks = resp.hits.hits.map(item => (0, _helper.fromESFormat)({
      id: item._id,
      ...item._source
    }));
    return customLinks;
  });
}