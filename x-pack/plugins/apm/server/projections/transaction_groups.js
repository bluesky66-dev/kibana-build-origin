"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionGroupsProjection = getTransactionGroupsProjection;

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../common/elasticsearch_fieldnames");

var _transactions = require("./transactions");

var _merge_projection = require("./util/merge_projection");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getTransactionGroupsProjection({
  setup,
  options
}) {
  const transactionsProjection = (0, _transactions.getTransactionsProjection)({
    setup,
    ...(0, _lodash.omit)(options, 'type')
  });

  if (options.type === 'top_traces') {
    if (options.searchAggregatedTransactions) {
      transactionsProjection.body.query.bool.filter.push({
        term: {
          [_elasticsearch_fieldnames.TRANSACTION_ROOT]: true
        }
      });
    } else {
      // @ts-expect-error: Property 'must_not' does not exist on type '{ filter: ESFilter[]; }'.
      transactionsProjection.body.query.bool.must_not = [{
        exists: {
          field: _elasticsearch_fieldnames.PARENT_ID
        }
      }];
    }
  }

  return (0, _merge_projection.mergeProjection)(transactionsProjection, {
    body: {
      aggs: {
        transactions: {
          terms: {
            field: _elasticsearch_fieldnames.TRANSACTION_NAME
          }
        }
      }
    }
  });
}