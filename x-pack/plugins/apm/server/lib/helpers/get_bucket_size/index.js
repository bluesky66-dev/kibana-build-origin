"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketSize = getBucketSize;

var _moment = _interopRequireDefault(require("moment"));

var _calculate_auto = require("./calculate_auto");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error


function getBucketSize({
  start,
  end,
  numBuckets = 100
}) {
  const duration = _moment.default.duration(end - start, 'ms');

  const bucketSize = Math.max(_calculate_auto.calculateAuto.near(numBuckets, duration).asSeconds(), 1);
  const intervalString = `${bucketSize}s`;

  if (bucketSize < 0) {
    return {
      bucketSize: 0,
      intervalString: 'auto'
    };
  }

  return {
    bucketSize,
    intervalString
  };
}