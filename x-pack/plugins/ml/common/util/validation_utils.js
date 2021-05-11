"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMostSevereMessageStatus = getMostSevereMessageStatus;
exports.isValidJson = isValidJson;
exports.findAggField = findAggField;
exports.isValidAggregationField = isValidAggregationField;

var _validation = require("../constants/validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// get the most severe status level from a list of messages


const contains = (arr, str) => arr.indexOf(str) >= 0;

function getMostSevereMessageStatus(messages) {
  const statuses = messages.map(m => m.status);
  return [_validation.VALIDATION_STATUS.INFO, _validation.VALIDATION_STATUS.WARNING, _validation.VALIDATION_STATUS.ERROR].reduce((previous, current) => {
    return contains(statuses, current) ? current : previous;
  }, _validation.VALIDATION_STATUS.SUCCESS);
}

function isValidJson(json) {
  if (json === null) {
    return false;
  }

  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
}

function findAggField(aggs, fieldName, returnParent = false) {
  if (fieldName === undefined) return;
  let value;
  Object.keys(aggs).some(function (k) {
    if (k === fieldName) {
      value = returnParent === true ? aggs : aggs[k];
      return true;
    }

    if (aggs.hasOwnProperty(k) && aggs[k] !== null && typeof aggs[k] === 'object') {
      value = findAggField(aggs[k], fieldName, returnParent);
      return value !== undefined;
    }
  });
  return value;
}

function isValidAggregationField(aggs, fieldName) {
  return findAggField(aggs, fieldName) !== undefined;
}