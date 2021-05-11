"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServicesProjection = getServicesProjection;

var _elasticsearch_fieldnames = require("../../common/elasticsearch_fieldnames");

var _queries = require("../../common/utils/queries");

var _processor_event = require("../../common/processor_event");

var _aggregated_transactions = require("../lib/helpers/aggregated_transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServicesProjection({
  setup,
  searchAggregatedTransactions
}) {
  const {
    start,
    end,
    esFilter
  } = setup;
  return {
    apm: {
      events: [(0, _aggregated_transactions.getProcessorEventForAggregatedTransactions)(searchAggregatedTransactions), _processor_event.ProcessorEvent.metric, _processor_event.ProcessorEvent.error]
    },
    body: {
      size: 0,
      query: {
        bool: {
          filter: [...(0, _queries.rangeQuery)(start, end), ...esFilter]
        }
      },
      aggs: {
        services: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NAME
          }
        }
      }
    }
  };
}