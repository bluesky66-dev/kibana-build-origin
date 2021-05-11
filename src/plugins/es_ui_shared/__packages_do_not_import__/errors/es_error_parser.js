"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEsError = exports.getEsCause = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getEsCause = (obj = {}, causes = []) => {
  const updated = [...causes];

  if (obj.caused_by) {
    updated.push(obj.caused_by.reason); // Recursively find all the "caused by" reasons

    return getEsCause(obj.caused_by, updated);
  }

  return updated.filter(Boolean);
};

exports.getEsCause = getEsCause;

const parseEsError = err => {
  try {
    const {
      error
    } = JSON.parse(err);
    const cause = getEsCause(error);
    return {
      message: error.reason,
      cause
    };
  } catch (e) {
    return {
      message: err,
      cause: []
    };
  }
};

exports.parseEsError = parseEsError;