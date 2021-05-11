"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unpackProcessorEvents = unpackProcessorEvents;

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../../common/processor_event");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const processorEventIndexMap = {
  [_processor_event.ProcessorEvent.transaction]: 'apm_oss.transactionIndices',
  [_processor_event.ProcessorEvent.span]: 'apm_oss.spanIndices',
  [_processor_event.ProcessorEvent.metric]: 'apm_oss.metricsIndices',
  [_processor_event.ProcessorEvent.error]: 'apm_oss.errorIndices'
};

function unpackProcessorEvents(request, indices) {
  const {
    apm,
    ...params
  } = request;
  const events = (0, _lodash.uniq)(apm.events);
  const index = events.map(event => indices[processorEventIndexMap[event]]);
  const withFilterForProcessorEvent = (0, _lodash.defaultsDeep)((0, _lodash.cloneDeep)(params), {
    body: {
      query: {
        bool: {
          filter: []
        }
      }
    }
  });
  withFilterForProcessorEvent.body.query.bool.filter.push({
    terms: {
      [_elasticsearch_fieldnames.PROCESSOR_EVENT]: events
    }
  });
  return {
    index,
    ...withFilterForProcessorEvent
  };
}