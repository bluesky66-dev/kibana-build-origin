"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSignalsCount = void 0;

var _build_signals_query = require("./build_signals_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getSignalsCount = async ({
  from,
  to,
  ruleId,
  index,
  callCluster
}) => {
  if (from == null || to == null) {
    throw Error('"from" or "to" was not provided to signals count query');
  }

  const query = (0, _build_signals_query.buildSignalsSearchQuery)({
    index,
    ruleId,
    to,
    from
  });
  const result = await callCluster('count', query);
  return result.count;
};

exports.getSignalsCount = getSignalsCount;