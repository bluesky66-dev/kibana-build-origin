"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBucketAggType = isBucketAggType;
exports.BucketAggType = void 0;

var _agg_type = require("../agg_type");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const bucketType = 'buckets';

class BucketAggType extends _agg_type.AggType {
  constructor(config) {
    super(config);

    _defineProperty(this, "getKey", void 0);

    _defineProperty(this, "type", bucketType);

    this.getKey = config.getKey || ((bucket, key) => {
      return key || bucket.key;
    });
  }

}

exports.BucketAggType = BucketAggType;

function isBucketAggType(aggConfig) {
  return aggConfig && aggConfig.type === bucketType;
}