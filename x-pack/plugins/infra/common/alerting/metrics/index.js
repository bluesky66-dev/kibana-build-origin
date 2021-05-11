"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  INFRA_ALERT_PREVIEW_PATH: true,
  TOO_MANY_BUCKETS_PREVIEW_EXCEPTION: true,
  isTooManyBucketsPreviewException: true
};
exports.isTooManyBucketsPreviewException = exports.TOO_MANY_BUCKETS_PREVIEW_EXCEPTION = exports.INFRA_ALERT_PREVIEW_PATH = void 0;

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INFRA_ALERT_PREVIEW_PATH = '/api/infra/alerting/preview';
exports.INFRA_ALERT_PREVIEW_PATH = INFRA_ALERT_PREVIEW_PATH;
const TOO_MANY_BUCKETS_PREVIEW_EXCEPTION = 'TOO_MANY_BUCKETS_PREVIEW_EXCEPTION';
exports.TOO_MANY_BUCKETS_PREVIEW_EXCEPTION = TOO_MANY_BUCKETS_PREVIEW_EXCEPTION;

const isTooManyBucketsPreviewException = value => Boolean(value && value.TOO_MANY_BUCKETS_PREVIEW_EXCEPTION);

exports.isTooManyBucketsPreviewException = isTooManyBucketsPreviewException;