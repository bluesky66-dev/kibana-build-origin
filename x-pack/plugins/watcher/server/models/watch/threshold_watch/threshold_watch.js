"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThresholdWatch = void 0;

var _lodash = require("lodash");

var _base_watch = require("../base_watch");

var _constants = require("../../../../common/constants");

var _serialization = require("../../../../common/lib/serialization");

var _build_visualize_query = require("./build_visualize_query");

var _format_visualize_data = require("./format_visualize_data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ThresholdWatch extends _base_watch.BaseWatch {
  // This constructor should not be used directly.
  // JsonWatch objects should be instantiated using the
  // fromUpstreamJson and fromDownstreamJson static methods
  constructor(props) {
    super(props);
    this.index = props.index;
    this.timeField = props.timeField;
    this.triggerIntervalSize = props.triggerIntervalSize;
    this.triggerIntervalUnit = props.triggerIntervalUnit;
    this.aggType = props.aggType;
    this.aggField = props.aggField;
    this.termSize = props.termSize;
    this.termField = props.termField;
    this.thresholdComparator = props.thresholdComparator;
    this.timeWindowSize = props.timeWindowSize;
    this.timeWindowUnit = props.timeWindowUnit;
    this.threshold = props.threshold;
  }

  get hasTermsAgg() {
    return Boolean(this.termField);
  }

  get termOrder() {
    return this.thresholdComparator === _constants.COMPARATORS.GREATER_THAN ? _constants.SORT_ORDERS.DESCENDING : _constants.SORT_ORDERS.ASCENDING;
  }

  get watchJson() {
    return (0, _serialization.serializeThresholdWatch)(this);
  }

  getVisualizeQuery(visualizeOptions) {
    return (0, _build_visualize_query.buildVisualizeQuery)(this, visualizeOptions);
  }

  formatVisualizeData(results) {
    return (0, _format_visualize_data.formatVisualizeData)(this, results);
  } // To Kibana


  get downstreamJson() {
    const result = (0, _lodash.merge)({}, super.downstreamJson, {
      index: this.index,
      timeField: this.timeField,
      triggerIntervalSize: this.triggerIntervalSize,
      triggerIntervalUnit: this.triggerIntervalUnit,
      aggType: this.aggType,
      aggField: this.aggField,
      termSize: this.termSize,
      termField: this.termField,
      thresholdComparator: this.thresholdComparator,
      timeWindowSize: this.timeWindowSize,
      timeWindowUnit: this.timeWindowUnit,
      threshold: this.threshold
    });
    return result;
  } // from Elasticsearch


  static fromUpstreamJson(json) {
    const metadata = json.watchJson.metadata.watcherui;
    const props = (0, _lodash.merge)({}, super.getPropsFromUpstreamJson(json), {
      type: _constants.WATCH_TYPES.THRESHOLD,
      index: metadata.index,
      timeField: metadata.time_field,
      triggerIntervalSize: metadata.trigger_interval_size,
      triggerIntervalUnit: metadata.trigger_interval_unit,
      aggType: metadata.agg_type,
      aggField: metadata.agg_field,
      termSize: metadata.term_size,
      termField: metadata.term_field,
      thresholdComparator: metadata.threshold_comparator,
      timeWindowSize: metadata.time_window_size,
      timeWindowUnit: metadata.time_window_unit,
      threshold: Array.isArray(metadata.threshold) ? metadata.threshold : [metadata.threshold]
    });
    return new ThresholdWatch(props);
  } // from Kibana


  static fromDownstreamJson({
    id,
    name,
    actions,
    index,
    timeField,
    triggerIntervalSize,
    triggerIntervalUnit,
    aggType,
    aggField,
    termSize,
    termField,
    thresholdComparator,
    timeWindowSize,
    timeWindowUnit,
    threshold
  }) {
    const props = {
      type: _constants.WATCH_TYPES.THRESHOLD,
      id,
      name,
      actions,
      index,
      timeField,
      triggerIntervalSize,
      triggerIntervalUnit,
      aggType,
      aggField,
      termSize,
      termField,
      thresholdComparator,
      timeWindowSize,
      timeWindowUnit,
      threshold
    };
    return new ThresholdWatch(props);
  }

}

exports.ThresholdWatch = ThresholdWatch;