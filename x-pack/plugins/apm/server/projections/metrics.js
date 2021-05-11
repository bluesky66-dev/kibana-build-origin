"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricsProjection = getMetricsProjection;

var _elasticsearch_fieldnames = require("../../common/elasticsearch_fieldnames");

var _queries = require("../../common/utils/queries");

var _service_nodes = require("../../common/service_nodes");

var _processor_event = require("../../common/processor_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceNodeNameFilters(serviceNodeName) {
  if (!serviceNodeName) {
    return [];
  }

  if (serviceNodeName === _service_nodes.SERVICE_NODE_NAME_MISSING) {
    return [{
      bool: {
        must_not: [{
          exists: {
            field: _elasticsearch_fieldnames.SERVICE_NODE_NAME
          }
        }]
      }
    }];
  }

  return [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NODE_NAME]: serviceNodeName
    }
  }];
}

function getMetricsProjection({
  environment,
  setup,
  serviceName,
  serviceNodeName
}) {
  const {
    start,
    end,
    esFilter
  } = setup;
  const filter = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, ...getServiceNodeNameFilters(serviceNodeName), ...(0, _queries.rangeQuery)(start, end), ...(0, _queries.environmentQuery)(environment), ...esFilter];
  return {
    apm: {
      events: [_processor_event.ProcessorEvent.metric]
    },
    body: {
      query: {
        bool: {
          filter
        }
      }
    }
  };
}