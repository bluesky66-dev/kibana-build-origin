"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRangeBucketAgg = void 0;

var _i18n = require("@kbn/i18n");

var _common = require("../../../../common");

var _bucket_agg_type = require("./bucket_agg_type");

var _range_fn = require("./range_fn");

var _range_key = require("./range_key");

var _range = require("./create_filter/range");

var _bucket_agg_types = require("./bucket_agg_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const rangeTitle = _i18n.i18n.translate('data.search.aggs.buckets.rangeTitle', {
  defaultMessage: 'Range'
});

const getRangeBucketAgg = ({
  getFieldFormatsStart
}) => {
  const keyCaches = new WeakMap();
  return new _bucket_agg_type.BucketAggType({
    name: _bucket_agg_types.BUCKET_TYPES.RANGE,
    expressionName: _range_fn.aggRangeFnName,
    title: rangeTitle,
    createFilter: (0, _range.createFilterRange)(getFieldFormatsStart),

    makeLabel(aggConfig) {
      return _i18n.i18n.translate('data.search.aggs.aggTypesLabel', {
        defaultMessage: '{fieldName} ranges',
        values: {
          fieldName: aggConfig.getFieldDisplayName()
        }
      });
    },

    getKey(bucket, key, agg) {
      let keys = keyCaches.get(agg);

      if (!keys) {
        keys = new Map();
        keyCaches.set(agg, keys);
      }

      const id = _range_key.RangeKey.idBucket(bucket);

      key = keys.get(id);

      if (!key) {
        key = new _range_key.RangeKey(bucket, agg.params.ranges);
        keys.set(id, key);
      }

      return key;
    },

    getSerializedFormat(agg) {
      const format = agg.params.field ? agg.aggConfigs.indexPattern.getFormatterForField(agg.params.field).toJSON() : {
        id: undefined,
        params: undefined
      };
      return {
        id: 'range',
        params: {
          id: format.id,
          params: format.params
        }
      };
    },

    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: [_common.KBN_FIELD_TYPES.NUMBER]
    }, {
      name: 'ranges',
      default: [{
        from: 0,
        to: 1000
      }, {
        from: 1000,
        to: 2000
      }],

      write(aggConfig, output) {
        var _ranges;

        output.params.ranges = (_ranges = aggConfig.params.ranges) === null || _ranges === void 0 ? void 0 : _ranges.map(range => ({
          to: range.to,
          from: range.from
        }));
        output.params.keyed = true;
      }

    }]
  });
};

exports.getRangeBucketAgg = getRangeBucketAgg;