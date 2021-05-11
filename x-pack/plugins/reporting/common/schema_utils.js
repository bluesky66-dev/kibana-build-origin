"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.byteSizeValueToNumber = exports.durationToNumber = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * For cleaner code: use these functions when a config schema value could be
 * one type or another.  This allows you to treat the value as one type.
 */

const durationToNumber = value => {
  if (typeof value === 'number') {
    return value;
  }

  return value.asMilliseconds();
};

exports.durationToNumber = durationToNumber;

const byteSizeValueToNumber = value => {
  if (typeof value === 'number') {
    return value;
  }

  return value.getValueInBytes();
};

exports.byteSizeValueToNumber = byteSizeValueToNumber;