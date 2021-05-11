"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRumPageLoadTransactionsProjection = getRumPageLoadTransactionsProjection;
exports.getRumErrorsProjection = getRumErrorsProjection;

var _elasticsearch_fieldnames = require("../../common/elasticsearch_fieldnames");

var _queries = require("../../common/utils/queries");

var _processor_event = require("../../common/processor_event");

var _transaction_types = require("../../common/transaction_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getRumPageLoadTransactionsProjection({
  setup,
  urlQuery,
  checkFetchStartFieldExists = true
}) {
  const {
    start,
    end,
    esFilter
  } = setup;
  const bool = {
    filter: [...(0, _queries.rangeQuery)(start, end), {
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_TYPE]: _transaction_types.TRANSACTION_PAGE_LOAD
      }
    }, ...(checkFetchStartFieldExists ? [{
      // Adding this filter to cater for some inconsistent rum data
      // not available on aggregated transactions
      exists: {
        field: 'transaction.marks.navigationTiming.fetchStart'
      }
    }] : []), ...(urlQuery ? [{
      wildcard: {
        'url.full': {
          value: `*${urlQuery}*`
        }
      }
    }] : []), ...esFilter]
  };
  return {
    apm: {
      events: [_processor_event.ProcessorEvent.transaction]
    },
    body: {
      query: {
        bool
      }
    }
  };
}

function getRumErrorsProjection({
  setup,
  urlQuery
}) {
  const {
    start,
    end,
    esFilter: esFilter
  } = setup;
  const bool = {
    filter: [...(0, _queries.rangeQuery)(start, end), {
      term: {
        [_elasticsearch_fieldnames.AGENT_NAME]: 'rum-js'
      }
    }, {
      term: {
        [_elasticsearch_fieldnames.SERVICE_LANGUAGE_NAME]: 'javascript'
      }
    }, ...esFilter, ...(urlQuery ? [{
      wildcard: {
        'url.full': {
          value: `*${urlQuery}*`
        }
      }
    }] : [])]
  };
  return {
    apm: {
      events: [_processor_event.ProcessorEvent.error]
    },
    body: {
      query: {
        bool
      }
    }
  };
}