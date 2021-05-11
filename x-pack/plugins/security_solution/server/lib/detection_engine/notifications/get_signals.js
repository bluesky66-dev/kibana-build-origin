"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignals = void 0;

var _build_signals_query = require("./build_signals_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getSignals = async ({
  from,
  to,
  size,
  ruleId,
  index,
  callCluster
}) => {
  if (from == null || to == null) {
    throw Error('"from" or "to" was not provided to signals query');
  }

  const query = (0, _build_signals_query.buildSignalsSearchQuery)({
    index,
    ruleId,
    to,
    from,
    size
  });
  const result = await callCluster('search', query);
  return result;
};

exports.getSignals = getSignals;