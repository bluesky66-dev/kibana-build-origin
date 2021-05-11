"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maxLengthValidator = maxLengthValidator;
exports.patternValidator = patternValidator;
exports.composeValidators = composeValidators;
exports.requiredValidator = requiredValidator;
exports.memoryInputValidator = memoryInputValidator;
exports.timeIntervalInputValidator = timeIntervalInputValidator;

var _validation = require("../constants/validation");

var _parse_interval = require("./parse_interval");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Provides a validator function for maximum allowed input length.
 * @param maxLength Maximum length allowed.
 */


function maxLengthValidator(maxLength) {
  return value => value && value.length > maxLength ? {
    maxLength: {
      requiredLength: maxLength,
      actualLength: value.length
    }
  } : null;
}
/**
 * Provides a validator function for checking against pattern.
 * @param pattern
 */


function patternValidator(pattern) {
  return value => pattern.test(value) ? null : {
    pattern: {
      matchPattern: pattern.toString()
    }
  };
}
/**
 * Composes multiple validators into a single function
 * @param validators
 */


function composeValidators(...validators) {
  return value => {
    const validationResult = validators.reduce((acc, validator) => {
      return { ...acc,
        ...(validator(value) || {})
      };
    }, {});
    return Object.keys(validationResult).length > 0 ? validationResult : null;
  };
}

function requiredValidator() {
  return value => {
    return value === '' || value === undefined || value === null ? {
      required: true
    } : null;
  };
}

function memoryInputValidator(allowedUnits = _validation.ALLOWED_DATA_UNITS) {
  return value => {
    if (typeof value !== 'string' || value === '') {
      return null;
    }

    const regexp = new RegExp(`\\d+(${allowedUnits.join('|')})$`, 'i');
    return regexp.test(value.trim()) ? null : {
      invalidUnits: {
        allowedUnits: allowedUnits.join(', ')
      }
    };
  };
}

function timeIntervalInputValidator() {
  return value => {
    const r = (0, _parse_interval.parseInterval)(value);

    if (r === null) {
      return {
        invalidTimeInterval: true
      };
    }

    return null;
  };
}