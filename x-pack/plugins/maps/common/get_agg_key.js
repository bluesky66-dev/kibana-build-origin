"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJoinAggKey = getJoinAggKey;
exports.getSourceAggKey = getSourceAggKey;

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getJoinAggKey({
  aggType,
  aggFieldName,
  rightSourceId
}) {
  const metricKey = aggType !== _constants.AGG_TYPE.COUNT ? `${aggType}${_constants.AGG_DELIMITER}${aggFieldName}` : aggType;
  return `${_constants.JOIN_FIELD_NAME_PREFIX}${metricKey}__${rightSourceId}`;
}

function getSourceAggKey({
  aggType,
  aggFieldName
}) {
  return aggType !== _constants.AGG_TYPE.COUNT ? `${aggType}${_constants.AGG_DELIMITER}${aggFieldName}` : _constants.COUNT_PROP_NAME;
}