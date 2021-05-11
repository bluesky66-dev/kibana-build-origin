"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseIsoOrRelativeDate = parseIsoOrRelativeDate;

var _parse_duration = require("../../common/parse_duration");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Parse an ISO date or NNx duration string as a Date
 *
 * @param dateString an ISO date or NNx "duration" string representing now-duration
 * @returns a Date or undefined if the dateString was not valid
 */


function parseIsoOrRelativeDate(dateString) {
  const epochMillis = Date.parse(dateString);
  if (!isNaN(epochMillis)) return new Date(epochMillis);
  let millis;

  try {
    millis = (0, _parse_duration.parseDuration)(dateString);
  } catch (err) {
    return;
  }

  return new Date(Date.now() - millis);
}