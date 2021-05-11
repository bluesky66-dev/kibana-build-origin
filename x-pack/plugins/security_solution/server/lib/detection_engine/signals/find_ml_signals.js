"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findMlSignals = void 0;

var _datemath = _interopRequireDefault(require("@elastic/datemath"));

var _machine_learning = require("../../machine_learning");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findMlSignals = async ({
  ml,
  request,
  savedObjectsClient,
  jobId,
  anomalyThreshold,
  from,
  to,
  exceptionItems
}) => {
  var _dateMath$parse$value, _dateMath$parse, _dateMath$parse$value2, _dateMath$parse2;

  const {
    mlAnomalySearch
  } = ml.mlSystemProvider(request, savedObjectsClient);
  const params = {
    jobIds: [jobId],
    threshold: anomalyThreshold,
    earliestMs: (_dateMath$parse$value = (_dateMath$parse = _datemath.default.parse(from)) === null || _dateMath$parse === void 0 ? void 0 : _dateMath$parse.valueOf()) !== null && _dateMath$parse$value !== void 0 ? _dateMath$parse$value : 0,
    latestMs: (_dateMath$parse$value2 = (_dateMath$parse2 = _datemath.default.parse(to)) === null || _dateMath$parse2 === void 0 ? void 0 : _dateMath$parse2.valueOf()) !== null && _dateMath$parse$value2 !== void 0 ? _dateMath$parse$value2 : 0,
    exceptionItems
  };
  return (0, _machine_learning.getAnomalies)(params, mlAnomalySearch);
};

exports.findMlSignals = findMlSignals;