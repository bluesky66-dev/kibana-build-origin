"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asDynamicBytes = exports.getFixedByteFormatter = void 0;

var _lodash = require("lodash");

var _formatters = require("./formatters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function asKilobytes(value) {
  return `${(0, _formatters.asDecimal)(value / 1000)} KB`;
}

function asMegabytes(value) {
  return `${(0, _formatters.asDecimal)(value / 1e6)} MB`;
}

function asGigabytes(value) {
  return `${(0, _formatters.asDecimal)(value / 1e9)} GB`;
}

function asTerabytes(value) {
  return `${(0, _formatters.asDecimal)(value / 1e12)} TB`;
}

function asBytes(value) {
  return `${(0, _formatters.asDecimal)(value)} B`;
}

const bailIfNumberInvalid = cb => {
  return val => {
    if (val === null || val === undefined || isNaN(val)) {
      return '';
    }

    return cb(val);
  };
};

const getFixedByteFormatter = (0, _lodash.memoize)(max => {
  const formatter = unmemoizedFixedByteFormatter(max);
  return bailIfNumberInvalid(formatter);
});
exports.getFixedByteFormatter = getFixedByteFormatter;
const asDynamicBytes = bailIfNumberInvalid(value => {
  return unmemoizedFixedByteFormatter(value)(value);
});
exports.asDynamicBytes = asDynamicBytes;

const unmemoizedFixedByteFormatter = max => {
  if (max > 1e12) {
    return asTerabytes;
  }

  if (max > 1e9) {
    return asGigabytes;
  }

  if (max > 1e6) {
    return asMegabytes;
  }

  if (max > 1000) {
    return asKilobytes;
  }

  return asBytes;
};