"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateAvailability = calculateAvailability;

var _moment = _interopRequireDefault(require("moment"));

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

/*
 * Return `true` if timestamp of last update is younger than 10 minutes ago
 * If older than, it indicates cluster/instance is offline
 */


function calculateAvailability(timestamp) {
  const lastUpdate = (0, _moment.default)(timestamp); // converts to local time

  return lastUpdate.isAfter((0, _moment.default)().subtract(10, 'minutes')); // compares with local time
}