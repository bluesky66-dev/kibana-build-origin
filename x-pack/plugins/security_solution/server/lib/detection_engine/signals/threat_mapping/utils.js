"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractNamedQueries = exports.decodeThreatMatchNamedQuery = exports.encodeThreatMatchNamedQuery = exports.combineConcurrentResults = exports.combineResults = exports.calculateMaxLookBack = exports.calculateMax = exports.calculateAdditiveMax = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given two timers this will take the max of each and add them to each other and return that addition.
 * Max(timer_array_1) + Max(timer_array_2)
 * @param existingTimers String array of existing timers
 * @param newTimers String array of new timers.
 * @returns String array of the new maximum between the two timers
 */

const calculateAdditiveMax = (existingTimers, newTimers) => {
  const numericNewTimerMax = Math.max(0, ...newTimers.map(time => +time));
  const numericExistingTimerMax = Math.max(0, ...existingTimers.map(time => +time));
  return [String(numericNewTimerMax + numericExistingTimerMax)];
};
/**
 * Given two timers this will take the max of each and then get the max from each.
 * Max(Max(timer_array_1), Max(timer_array_2))
 * @param existingTimers String array of existing timers
 * @param newTimers String array of new timers.
 * @returns String array of the new maximum between the two timers
 */


exports.calculateAdditiveMax = calculateAdditiveMax;

const calculateMax = (existingTimers, newTimers) => {
  const numericNewTimerMax = Math.max(0, ...newTimers.map(time => +time));
  const numericExistingTimerMax = Math.max(0, ...existingTimers.map(time => +time));
  return String(Math.max(numericNewTimerMax, numericExistingTimerMax));
};
/**
 * Given two dates this will return the larger of the two unless one of them is null
 * or undefined. If both one or the other is null/undefined it will return the newDate.
 * If there is a mix of "undefined" and "null", this will prefer to set it to "null" as having
 * a higher value than "undefined"
 * @param existingDate The existing date which can be undefined or null or a date
 * @param newDate The new date which can be undefined or null or a date
 */


exports.calculateMax = calculateMax;

const calculateMaxLookBack = (existingDate, newDate) => {
  const newDateValue = newDate === null ? 1 : newDate === undefined ? 0 : newDate.valueOf();
  const existingDateValue = existingDate === null ? 1 : existingDate === undefined ? 0 : existingDate.valueOf();

  if (newDateValue >= existingDateValue) {
    return newDate;
  } else {
    return existingDate;
  }
};
/**
 * Combines two results together and returns the results combined
 * @param currentResult The current result to combine with a newResult
 * @param newResult The new result to combine
 */


exports.calculateMaxLookBack = calculateMaxLookBack;

const combineResults = (currentResult, newResult) => ({
  success: currentResult.success === false ? false : newResult.success,
  bulkCreateTimes: calculateAdditiveMax(currentResult.bulkCreateTimes, newResult.bulkCreateTimes),
  searchAfterTimes: calculateAdditiveMax(currentResult.searchAfterTimes, newResult.searchAfterTimes),
  lastLookBackDate: newResult.lastLookBackDate,
  createdSignalsCount: currentResult.createdSignalsCount + newResult.createdSignalsCount,
  createdSignals: [...currentResult.createdSignals, ...newResult.createdSignals],
  errors: [...new Set([...currentResult.errors, ...newResult.errors])]
});
/**
 * Combines two results together and returns the results combined
 * @param currentResult The current result to combine with a newResult
 * @param newResult The new result to combine
 */


exports.combineResults = combineResults;

const combineConcurrentResults = (currentResult, newResult) => {
  const maxedNewResult = newResult.reduce((accum, item) => {
    const maxSearchAfterTime = calculateMax(accum.searchAfterTimes, item.searchAfterTimes);
    const maxBulkCreateTimes = calculateMax(accum.bulkCreateTimes, item.bulkCreateTimes);
    const lastLookBackDate = calculateMaxLookBack(accum.lastLookBackDate, item.lastLookBackDate);
    return {
      success: accum.success && item.success,
      searchAfterTimes: [maxSearchAfterTime],
      bulkCreateTimes: [maxBulkCreateTimes],
      lastLookBackDate,
      createdSignalsCount: accum.createdSignalsCount + item.createdSignalsCount,
      createdSignals: [...accum.createdSignals, ...item.createdSignals],
      errors: [...new Set([...accum.errors, ...item.errors])]
    };
  }, {
    success: true,
    searchAfterTimes: [],
    bulkCreateTimes: [],
    lastLookBackDate: undefined,
    createdSignalsCount: 0,
    createdSignals: [],
    errors: []
  });
  return combineResults(currentResult, maxedNewResult);
};

exports.combineConcurrentResults = combineConcurrentResults;
const separator = '__SEP__';

const encodeThreatMatchNamedQuery = ({
  id,
  index,
  field,
  value
}) => {
  return [id, index, field, value].join(separator);
};

exports.encodeThreatMatchNamedQuery = encodeThreatMatchNamedQuery;

const decodeThreatMatchNamedQuery = encoded => {
  const queryValues = encoded.split(separator);
  const [id, index, field, value] = queryValues;
  const query = {
    id,
    index,
    field,
    value
  };

  if (queryValues.length !== 4 || !queryValues.every(Boolean)) {
    const queryString = JSON.stringify(query);
    throw new Error(`Decoded query is invalid. Decoded value: ${queryString}`);
  }

  return query;
};

exports.decodeThreatMatchNamedQuery = decodeThreatMatchNamedQuery;

const extractNamedQueries = hit => {
  var _hit$matched_queries$, _hit$matched_queries;

  return (_hit$matched_queries$ = (_hit$matched_queries = hit.matched_queries) === null || _hit$matched_queries === void 0 ? void 0 : _hit$matched_queries.map(match => decodeThreatMatchNamedQuery(match))) !== null && _hit$matched_queries$ !== void 0 ? _hit$matched_queries$ : [];
};

exports.extractNamedQueries = extractNamedQueries;