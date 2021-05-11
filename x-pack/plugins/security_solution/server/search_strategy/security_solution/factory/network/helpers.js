"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOppositeField = void 0;

var _utility_types = require("../../../../../common/utility_types");

var _network = require("../../../../../common/search_strategy/security_solution/network");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getOppositeField = flowTarget => {
  switch (flowTarget) {
    case _network.FlowTargetSourceDest.source:
      return _network.FlowTargetSourceDest.destination;

    case _network.FlowTargetSourceDest.destination:
      return _network.FlowTargetSourceDest.source;
  }

  (0, _utility_types.assertUnreachable)(flowTarget);
};

exports.getOppositeField = getOppositeField;