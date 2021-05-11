"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateStatus$ = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _status = require("../status");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const calculateStatus$ = esNodesCompatibility$ => (0, _rxjs.merge)((0, _rxjs.of)({
  level: _status.ServiceStatusLevels.unavailable,
  summary: `Waiting for Elasticsearch`,
  meta: {
    warningNodes: [],
    incompatibleNodes: []
  }
}), esNodesCompatibility$.pipe((0, _operators.map)(({
  isCompatible,
  message,
  incompatibleNodes,
  warningNodes
}) => {
  if (!isCompatible) {
    return {
      level: _status.ServiceStatusLevels.critical,
      summary: // Message should always be present, but this is a safe fallback
      message !== null && message !== void 0 ? message : `Some Elasticsearch nodes are not compatible with this version of Kibana`,
      meta: {
        warningNodes,
        incompatibleNodes
      }
    };
  } else if (warningNodes.length > 0) {
    return {
      level: _status.ServiceStatusLevels.available,
      summary: // Message should always be present, but this is a safe fallback
      message !== null && message !== void 0 ? message : `Some Elasticsearch nodes are running different versions than this version of Kibana`,
      meta: {
        warningNodes,
        incompatibleNodes
      }
    };
  }

  return {
    level: _status.ServiceStatusLevels.available,
    summary: `Elasticsearch is available`,
    meta: {
      warningNodes: [],
      incompatibleNodes: []
    }
  };
})));

exports.calculateStatus$ = calculateStatus$;