"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggIpRange = exports.aggIpRangeFnName = void 0;

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
const aggIpRangeFnName = 'aggIpRange';
exports.aggIpRangeFnName = aggIpRangeFnName;

const aggIpRange = () => ({
  name: aggIpRangeFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.ipRange.help', {
    defaultMessage: 'Generates a serialized agg config for a Ip Range agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    ipRangeType: {
      types: ['string'],
      options: ['mask', 'fromTo'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.ipRangeType.help', {
        defaultMessage: 'IP range type to use for this aggregation. Takes one of the following values: mask, fromTo.'
      })
    },
    ranges: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.ranges.help', {
        defaultMessage: 'Serialized ranges to use for this aggregation.'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.ipRange.customLabel.help', {
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
        type: _.BUCKET_TYPES.IP_RANGE,
        params: { ...rest,
          ranges: (0, _get_parsed_value.getParsedValue)(args, 'ranges')
        }
      }
    };
  }
});

exports.aggIpRange = aggIpRange;