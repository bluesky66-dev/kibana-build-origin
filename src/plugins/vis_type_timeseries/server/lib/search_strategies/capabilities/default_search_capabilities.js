"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultSearchCapabilities = void 0;

var _unit_to_seconds = require("../../vis_data/helpers/unit_to_seconds");

var _ui_restrictions = require("../../../../common/ui_restrictions");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getTimezoneFromRequest = request => {
  return request.payload.timerange.timezone;
};

class DefaultSearchCapabilities {
  constructor(request, fieldsCapabilities = {}) {
    this.request = request;
    this.fieldsCapabilities = fieldsCapabilities;
  }

  get defaultTimeInterval() {
    return null;
  }

  get whiteListedMetrics() {
    return this.createUiRestriction();
  }

  get whiteListedGroupByFields() {
    return this.createUiRestriction();
  }

  get whiteListedTimerangeModes() {
    return this.createUiRestriction();
  }

  get uiRestrictions() {
    return {
      [_ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_METRICS]: this.whiteListedMetrics,
      [_ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_GROUP_BY_FIELDS]: this.whiteListedGroupByFields,
      [_ui_restrictions.RESTRICTIONS_KEYS.WHITE_LISTED_TIMERANGE_MODES]: this.whiteListedTimerangeModes
    };
  }

  get searchTimezone() {
    return getTimezoneFromRequest(this.request);
  }

  createUiRestriction(restrictionsObject) {
    return {
      '*': !restrictionsObject,
      ...(restrictionsObject || {})
    };
  }

  parseInterval(interval) {
    return (0, _unit_to_seconds.parseInterval)(interval);
  }

  getSuitableUnit(intervalInSeconds) {
    return (0, _unit_to_seconds.getSuitableUnit)(intervalInSeconds);
  }

  convertIntervalToUnit(intervalString, unit) {
    const parsedInterval = this.parseInterval(intervalString);

    if ((parsedInterval === null || parsedInterval === void 0 ? void 0 : parsedInterval.unit) !== unit) {
      return (0, _unit_to_seconds.convertIntervalToUnit)(intervalString, unit);
    }

    return parsedInterval;
  }

  getValidTimeInterval(intervalString) {
    // Default search capabilities doesn't have any restrictions for the interval string
    return intervalString;
  }

}

exports.DefaultSearchCapabilities = DefaultSearchCapabilities;