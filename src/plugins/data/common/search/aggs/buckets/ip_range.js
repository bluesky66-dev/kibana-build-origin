"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIpRangeBucketAgg = exports.IP_RANGE_TYPES = void 0;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _bucket_agg_type = require("./bucket_agg_type");

var _bucket_agg_types = require("./bucket_agg_types");

var _ip_range = require("./create_filter/ip_range");

var _ip_range_fn = require("./ip_range_fn");

var _common = require("../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const ipRangeTitle = _i18n.i18n.translate('data.search.aggs.buckets.ipRangeTitle', {
  defaultMessage: 'IPv4 Range'
});

let IP_RANGE_TYPES;
exports.IP_RANGE_TYPES = IP_RANGE_TYPES;

(function (IP_RANGE_TYPES) {
  IP_RANGE_TYPES["FROM_TO"] = "fromTo";
  IP_RANGE_TYPES["MASK"] = "mask";
})(IP_RANGE_TYPES || (exports.IP_RANGE_TYPES = IP_RANGE_TYPES = {}));

const getIpRangeBucketAgg = () => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.IP_RANGE,
  expressionName: _ip_range_fn.aggIpRangeFnName,
  title: ipRangeTitle,
  createFilter: _ip_range.createFilterIpRange,

  getKey(bucket, key, agg) {
    if (agg.params.ipRangeType === IP_RANGE_TYPES.MASK) {
      return {
        type: 'mask',
        mask: key
      };
    }

    return {
      type: 'range',
      from: bucket.from,
      to: bucket.to
    };
  },

  getSerializedFormat(agg) {
    return {
      id: 'ip_range',
      params: agg.params.field ? agg.aggConfigs.indexPattern.getFormatterForField(agg.params.field).toJSON() : {}
    };
  },

  makeLabel(aggConfig) {
    return _i18n.i18n.translate('data.search.aggs.buckets.ipRangeLabel', {
      defaultMessage: '{fieldName} IP ranges',
      values: {
        fieldName: aggConfig.getFieldDisplayName()
      }
    });
  },

  params: [{
    name: 'field',
    type: 'field',
    filterFieldTypes: _common.KBN_FIELD_TYPES.IP
  }, {
    name: 'ipRangeType',
    default: IP_RANGE_TYPES.FROM_TO,
    write: _lodash.noop
  }, {
    name: 'ranges',
    default: {
      fromTo: [{
        from: '0.0.0.0',
        to: '127.255.255.255'
      }, {
        from: '128.0.0.0',
        to: '191.255.255.255'
      }],
      mask: [{
        mask: '0.0.0.0/1'
      }, {
        mask: '128.0.0.0/2'
      }]
    },

    write(aggConfig, output) {
      const ipRangeType = aggConfig.params.ipRangeType;
      let ranges = aggConfig.params.ranges[ipRangeType];

      if (ipRangeType === IP_RANGE_TYPES.FROM_TO) {
        ranges = (0, _lodash.map)(ranges, range => (0, _lodash.omitBy)(range, _lodash.isNull));
      }

      output.params.ranges = ranges;
    }

  }]
});

exports.getIpRangeBucketAgg = getIpRangeBucketAgg;