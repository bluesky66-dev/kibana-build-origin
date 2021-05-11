"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getShardDelayBucketAgg = exports.SHARD_DELAY_AGG_NAME = void 0;

var _bucket_agg_type = require("./bucket_agg_type");

var _shard_delay_fn = require("./shard_delay_fn");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const SHARD_DELAY_AGG_NAME = 'shard_delay';
exports.SHARD_DELAY_AGG_NAME = SHARD_DELAY_AGG_NAME;

const getShardDelayBucketAgg = () => new _bucket_agg_type.BucketAggType({
  name: SHARD_DELAY_AGG_NAME,
  title: 'Shard Delay',
  expressionName: _shard_delay_fn.aggShardDelayFnName,
  createFilter: () => ({
    match_all: {}
  }),
  customLabels: false,
  params: [{
    name: 'delay',
    type: 'string',
    default: '5s',

    write(aggConfig, output) {
      output.params = { ...output.params,
        value: aggConfig.params.delay
      };
    }

  }]
});

exports.getShardDelayBucketAgg = getShardDelayBucketAgg;