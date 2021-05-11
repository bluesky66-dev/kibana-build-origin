"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identifyEsError = identifyEsError;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function extractCausedByChain(causedBy = {}, accumulator = []) {
  const {
    reason,
    caused_by: innerCausedBy
  } = causedBy;

  if (reason) {
    accumulator.push(reason);
  }

  if (innerCausedBy) {
    return extractCausedByChain(innerCausedBy, accumulator);
  }

  return accumulator;
}
/**
 * Identified causes for ES Error
 *
 * @param err Object Error thrown by ES JS client
 * @return ES error cause
 */


function identifyEsError(err) {
  const {
    response
  } = err;

  if (response) {
    const {
      error
    } = JSON.parse(response);

    if (error) {
      const {
        root_cause: rootCause = [],
        caused_by: causedBy
      } = error;
      return [...extractCausedByChain(causedBy), ...rootCause.reduce((acc, innerRootCause) => extractCausedByChain(innerRootCause, acc), [])];
    }
  }

  return [];
}