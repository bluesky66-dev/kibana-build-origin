"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSignalStatusValidateTypeDependents = exports.validateId = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const validateId = signalStatus => {
  if (signalStatus.signal_ids != null && signalStatus.query != null) {
    return ['both "signal_ids" and "query" cannot exist, choose one or the other'];
  } else if (signalStatus.signal_ids == null && signalStatus.query == null) {
    return ['either "signal_ids" or "query" must be set'];
  } else {
    return [];
  }
};

exports.validateId = validateId;

const setSignalStatusValidateTypeDependents = schema => {
  return [...validateId(schema)];
};

exports.setSignalStatusValidateTypeDependents = setSignalStatusValidateTypeDependents;