"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findDifferencesRecursive = exports.exactCheck = void 0;

var _Either = require("fp-ts/lib/Either");

var _pipeable = require("fp-ts/lib/pipeable");

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given an original object and a decoded object this will return an error
 * if and only if the original object has additional keys that the decoded
 * object does not have. If the original decoded already has an error, then
 * this will return the error as is and not continue.
 *
 * NOTE: You MUST use t.exact(...) for this to operate correctly as your schema
 * needs to remove additional keys before the compare
 *
 * You might not need this in the future if the below issue is solved:
 * https://github.com/gcanti/io-ts/issues/322
 *
 * @param original The original to check if it has additional keys
 * @param decoded The decoded either which has either an existing error or the
 * decoded object which could have additional keys stripped from it.
 */


const exactCheck = (original, decoded) => {
  const onLeft = errors => (0, _Either.left)(errors);

  const onRight = decodedValue => {
    const differences = findDifferencesRecursive(original, decodedValue);

    if (differences.length !== 0) {
      const validationError = {
        value: differences,
        context: [],
        message: `invalid keys "${differences.join(',')}"`
      };
      const error = [validationError];
      return (0, _Either.left)(error);
    } else {
      return (0, _Either.right)(decodedValue);
    }
  };

  return (0, _pipeable.pipe)(decoded, (0, _Either.fold)(onLeft, onRight));
};

exports.exactCheck = exactCheck;

const findDifferencesRecursive = (original, decodedValue) => {
  if (decodedValue === null && original === null) {
    // both the decodedValue and the original are null which indicates that they are equal
    // so do not report differences
    return [];
  } else if (decodedValue == null) {
    try {
      // It is null and painful when the original contains an object or an array
      // the the decoded value does not have.
      return [JSON.stringify(original)];
    } catch (err) {
      return ['circular reference'];
    }
  } else if (typeof original !== 'object' || original == null) {
    // We are not an object or null so do not report differences
    return [];
  } else {
    const decodedKeys = Object.keys(decodedValue);
    const differences = Object.keys(original).flatMap(originalKey => {
      const foundKey = decodedKeys.some(key => key === originalKey);
      const topLevelKey = foundKey ? [] : [originalKey]; // I use lodash to cheat and get an any (not going to lie ;-))

      const valueObjectOrArrayOriginal = (0, _fp.get)(originalKey, original);
      const valueObjectOrArrayDecoded = (0, _fp.get)(originalKey, decodedValue);

      if ((0, _fp.isObject)(valueObjectOrArrayOriginal)) {
        return [...topLevelKey, ...findDifferencesRecursive(valueObjectOrArrayOriginal, valueObjectOrArrayDecoded)];
      } else if (Array.isArray(valueObjectOrArrayOriginal)) {
        return [...topLevelKey, ...valueObjectOrArrayOriginal.flatMap((arrayElement, index) => findDifferencesRecursive(arrayElement, (0, _fp.get)(index, valueObjectOrArrayDecoded)))];
      } else {
        return topLevelKey;
      }
    });
    return differences;
  }
};

exports.findDifferencesRecursive = findDifferencesRecursive;