"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFiltersBucketAgg = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _filters = require("./create_filter/filters");

var _utils = require("../utils");

var _bucket_agg_type = require("./bucket_agg_type");

var _bucket_agg_types = require("./bucket_agg_types");

var _filters_fn = require("./filters_fn");

var _common = require("../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const filtersTitle = _i18n.i18n.translate('data.search.aggs.buckets.filtersTitle', {
  defaultMessage: 'Filters',
  description: 'The name of an aggregation, that allows to specify multiple individual filters to group data by.'
});

const getFiltersBucketAgg = ({
  getConfig
}) => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.FILTERS,
  expressionName: _filters_fn.aggFiltersFnName,
  title: filtersTitle,
  createFilter: _filters.createFilterFilters,
  customLabels: false,
  params: [{
    name: 'filters',
    default: () => [{
      input: {
        query: '',
        language: getConfig(_common.UI_SETTINGS.SEARCH_QUERY_LANGUAGE)
      },
      label: ''
    }],

    write(aggConfig, output) {
      const inFilters = aggConfig.params.filters;
      if (!(0, _lodash.size)(inFilters)) return;
      const outFilters = (0, _lodash.transform)(inFilters, function (filters, filter) {
        const input = (0, _lodash.cloneDeep)(filter.input);

        if (!input) {
          console.log('malformed filter agg params, missing "input" query'); // eslint-disable-line no-console

          return;
        }

        const esQueryConfigs = (0, _common.getEsQueryConfig)({
          get: getConfig
        });
        const query = (0, _common.buildEsQuery)(aggConfig.getIndexPattern(), [input], [], esQueryConfigs);

        if (!query) {
          console.log('malformed filter agg params, missing "query" on input'); // eslint-disable-line no-console

          return;
        }

        const matchAllLabel = filter.input.query === '' ? '*' : '';
        const label = filter.label || matchAllLabel || (typeof filter.input.query === 'string' ? filter.input.query : (0, _utils.toAngularJSON)(filter.input.query));
        filters[label] = query;
      }, {});
      if (!(0, _lodash.size)(outFilters)) return;
      const params = output.params || (output.params = {});
      params.filters = outFilters;
    }

  }]
});

exports.getFiltersBucketAgg = getFiltersBucketAgg;