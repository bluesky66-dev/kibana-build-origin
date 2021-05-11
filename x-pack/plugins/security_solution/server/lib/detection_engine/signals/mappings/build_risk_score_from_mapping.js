"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRiskScoreFromMapping = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Calculates the final risk score for a detection alert based on:
 *   - source event object that can potentially contain fields representing risk score
 *   - the default score specified by the user
 *   - (optional) score mapping specified by the user ("map this field to the score")
 *
 * NOTE: Current MVP support is for mapping from a single field.
 */


const buildRiskScoreFromMapping = ({
  eventSource,
  riskScore,
  riskScoreMapping
}) => {
  if (!riskScoreMapping || !riskScoreMapping.length) {
    return defaultScore(riskScore);
  } // TODO: Expand by verifying fieldType from index via  doc._index


  const eventField = riskScoreMapping[0].field;
  const eventValue = (0, _fp.get)(eventField, eventSource);
  const eventValues = Array.isArray(eventValue) ? eventValue : [eventValue];
  const validNumbers = eventValues.map(toValidNumberOrMinusOne).filter(n => n > -1);

  if (validNumbers.length > 0) {
    const maxNumber = getMaxOf(validNumbers);
    return overriddenScore(maxNumber);
  }

  return defaultScore(riskScore);
};

exports.buildRiskScoreFromMapping = buildRiskScoreFromMapping;

function toValidNumberOrMinusOne(value) {
  if (typeof value === 'number' && isValidNumber(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const num = Number(value);

    if (isValidNumber(num)) {
      return num;
    }
  }

  return -1;
}

function isValidNumber(value) {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

function getMaxOf(array) {
  // NOTE: It's safer to use reduce rather than Math.max(...array). The latter won't handle large input.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
  return array.reduce((a, b) => Math.max(a, b));
}

function defaultScore(riskScore) {
  return {
    riskScore,
    riskScoreMeta: {}
  };
}

function overriddenScore(riskScore) {
  return {
    riskScore,
    riskScoreMeta: {
      riskScoreOverridden: true
    }
  };
}