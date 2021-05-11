"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "handleEsaggsRequest", {
  enumerable: true,
  get: function () {
    return _request_handler.handleRequest;
  }
});
exports.getEsaggsMeta = void 0;

var _i18n = require("@kbn/i18n");

var _request_handler = require("./request_handler");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'esaggs';

/** @internal */
const getEsaggsMeta = () => ({
  name,
  type: 'datatable',
  inputTypes: ['kibana_context', 'null'],
  help: _i18n.i18n.translate('data.functions.esaggs.help', {
    defaultMessage: 'Run AggConfig aggregation'
  }),
  args: {
    index: {
      types: ['index_pattern'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.esaggs.index.help', {
        defaultMessage: 'Index pattern retrieved with indexPatternLoad'
      })
    },
    aggs: {
      types: ['agg_type'],
      multi: true,
      default: [],
      help: _i18n.i18n.translate('data.search.functions.esaggs.aggConfigs.help', {
        defaultMessage: 'List of aggs configured with agg_type functions'
      })
    },
    metricsAtAllLevels: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('data.search.functions.esaggs.metricsAtAllLevels.help', {
        defaultMessage: 'Whether to include columns with metrics for each bucket level'
      })
    },
    partialRows: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('data.search.functions.esaggs.partialRows.help', {
        defaultMessage: 'Whether to return rows that only contain partial data'
      })
    },
    timeFields: {
      types: ['string'],
      multi: true,
      help: _i18n.i18n.translate('data.search.functions.esaggs.timeFields.help', {
        defaultMessage: 'Provide time fields to get the resolved time ranges for the query'
      })
    }
  }
});
/** @internal */


exports.getEsaggsMeta = getEsaggsMeta;