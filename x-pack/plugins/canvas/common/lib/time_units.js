"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeUnits = exports.TimeUnit = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let TimeUnit;
exports.TimeUnit = TimeUnit;

(function (TimeUnit) {
  TimeUnit["SECONDS"] = "s";
  TimeUnit["MINUTES"] = "m";
  TimeUnit["HOURS"] = "h";
  TimeUnit["DAYS"] = "d";
  TimeUnit["WEEKS"] = "w";
  TimeUnit["MONTHS"] = "M";
  TimeUnit["YEARS"] = "y";
})(TimeUnit || (exports.TimeUnit = TimeUnit = {}));

const timeUnits = {
  [TimeUnit.SECONDS]: 'second',
  [TimeUnit.MINUTES]: 'minute',
  [TimeUnit.HOURS]: 'hour',
  [TimeUnit.DAYS]: 'day',
  [TimeUnit.WEEKS]: 'week',
  [TimeUnit.MONTHS]: 'month',
  [TimeUnit.YEARS]: 'year'
};
exports.timeUnits = timeUnits;