"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateThroughput = calculateThroughput;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function calculateThroughput({
  start,
  end,
  value
}) {
  const durationAsMinutes = (end - start) / 1000 / 60;
  return value / durationAsMinutes;
}