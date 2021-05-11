"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggDateRange = exports.aggDateRangeFnName = void 0;

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
const aggDateRangeFnName = 'aggDateRange';
exports.aggDateRangeFnName = aggDateRangeFnName;

const aggDateRange = () => ({
  name: aggDateRangeFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.dateRange.help', {
    defaultMessage: 'Generates a serialized agg config for a Date Range agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    ranges: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.ranges.help', {
        defaultMessage: 'Serialized ranges to use for this aggregation.'
      })
    },
    time_zone: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.timeZone.help', {
        defaultMessage: 'Time zone to use for this aggregation.'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.dateRange.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
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
        type: _.BUCKET_TYPES.DATE_RANGE,
        params: { ...rest,
          ranges: (0, _get_parsed_value.getParsedValue)(args, 'ranges')
        }
      }
    };
  }
});

exports.aggDateRange = aggDateRange;