"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggFilters = exports.aggFiltersFnName = void 0;

var _i18n = require("@kbn/i18n");

var _ = require("../");

var _get_parsed_value = require("../utils/get_parsed_value");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const aggFiltersFnName = 'aggFilters';
exports.aggFiltersFnName = aggFiltersFnName;

const aggFilters = () => ({
  name: aggFiltersFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.filters.help', {
    defaultMessage: 'Generates a serialized agg config for a Filter agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.filters.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.filters.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.filters.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    filters: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.filters.filters.help', {
        defaultMessage: 'Filters to use for this aggregation'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.filters.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    }
  },
  fn: (input, args) => {
    const {
      id,
      enabled,
      schema,
      ...rest
    } = args;
    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        type: _.BUCKET_TYPES.FILTERS,
        params: { ...rest,
          filters: (0, _get_parsed_value.getParsedValue)(args, 'filters')
        }
      }
    };
  }
});

exports.aggFilters = aggFilters;