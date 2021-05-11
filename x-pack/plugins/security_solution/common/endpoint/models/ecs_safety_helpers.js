"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasValue = hasValue;
exports.firstNonNullValue = firstNonNullValue;
exports.values = values;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Use these functions to accecss information held in `ECSField`s.
 */

/**
 * True if the field contains `expected`. If the field contains an array, this will be true if the array contains `expected`.
 */

function hasValue(valueOrCollection, expected) {
  if (Array.isArray(valueOrCollection)) {
    return valueOrCollection.includes(expected);
  } else {
    return valueOrCollection === expected;
  }
}
/**
 * Return first non-null value. If the field contains an array, this will return the first value that isn't null. If the field isn't an array it'll be returned unless it's null.
 */


function firstNonNullValue(valueOrCollection) {
  if (valueOrCollection === null) {
    return undefined;
  } else if (Array.isArray(valueOrCollection)) {
    for (const value of valueOrCollection) {
      if (value !== null) {
        return value;
      }
    }
  } else {
    return valueOrCollection;
  }
}
/*
 * Get an array of all non-null values. If there is just 1 value, return it wrapped in an array. If there are multiple values, return the non-null ones.
 * Use this when you want to consistently access the value(s) as an array.
 */


function values(valueOrCollection) {
  if (Array.isArray(valueOrCollection)) {
    const nonNullValues = [];

    for (const value of valueOrCollection) {
      if (value !== null && value !== undefined) {
        nonNullValues.push(value);
      }
    }

    return nonNullValues;
  } else if (valueOrCollection !== null && valueOrCollection !== undefined) {
    // if there is a single non-null value, wrap it in an array and return it.
    return [valueOrCollection];
  } else {
    // if the value was null, return `[]`.
    return [];
  }
}