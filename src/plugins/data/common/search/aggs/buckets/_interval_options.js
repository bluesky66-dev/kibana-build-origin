"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.intervalOptions = exports.isAutoInterval = exports.autoInterval = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const autoInterval = 'auto';
exports.autoInterval = autoInterval;

const isAutoInterval = value => value === autoInterval;

exports.isAutoInterval = isAutoInterval;
const intervalOptions = [{
  display: _i18n.i18n.translate('data.search.aggs.buckets.intervalOptions.autoDisplayName', {
    defaultMessage: 'Auto'
  }),
  val: autoInterval,

  enabled(agg) {
    // not only do we need a time field, but the selected field needs
    // to be the time field. (see #3028)
    return agg.fieldIsTimeField();
  }

}, {
  display: _i18n.i18n.translate('data.search.aggs.buckets.intervalOptions.millisecondDisplayName', {
    defaultMessage: 'Millisecond'
  }),
  val: 'ms'
}, {
  display: _i18n.i18n.translate('data.search.aggs.buckets.intervalOptions.secondDisplayName', {
    defaultMessage: 'Second'
  }),
  val: 's'
}, {
  display: _i18n.i18n.translate('data.search.aggs.buckets.intervalOptions.minuteDisplayName', {
    defaultMessage: 'Minute'
  }),
  val: 'm'
}, {
  display: _i18n.i18n.translate('data.search.aggs.buckets.intervalOptions.hourlyDisplayName', {
    defaultMessage: 'Hour'
  }),
  val: 'h'
}, {
  display: _i18n.i18n.translate('data.search.aggs.buckets.intervalOptions.dailyDisplayName', {
    defaultMessage: 'Day'
  }),
  val: 'd'
}, {
  display: _i18n.i18n.translate('data.search.aggs.buckets.intervalOptions.weeklyDisplayName', {
    defaultMessage: 'Week'
  }),
  val: 'w'
}, {
  display: _i18n.i18n.translate('data.search.aggs.buckets.intervalOptions.monthlyDisplayName', {
    defaultMessage: 'Month'
  }),
  val: 'M'
}, {
  display: _i18n.i18n.translate('data.search.aggs.buckets.intervalOptions.yearlyDisplayName', {
    defaultMessage: 'Year'
  }),
  val: 'y'
}];
exports.intervalOptions = intervalOptions;