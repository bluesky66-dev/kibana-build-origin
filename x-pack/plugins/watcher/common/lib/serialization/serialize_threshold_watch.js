"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeThresholdWatch = serializeThresholdWatch;

var _constants = require("../../constants");

var _serialization_helpers = require("./serialization_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function serializeThresholdWatch({
  name,
  triggerIntervalSize,
  triggerIntervalUnit,
  index,
  timeWindowSize,
  timeWindowUnit,
  timeField,
  aggType,
  aggField,
  termField,
  termSize,
  termOrder,
  thresholdComparator,
  hasTermsAgg,
  threshold,
  actions,
  includeMetadata = true
}) {
  const serializedWatch = {
    trigger: (0, _serialization_helpers.buildTrigger)(triggerIntervalSize, triggerIntervalUnit),
    input: (0, _serialization_helpers.buildInput)({
      index,
      timeWindowSize,
      timeWindowUnit,
      timeField,
      aggType,
      aggField,
      termField,
      termSize,
      termOrder
    }),
    condition: (0, _serialization_helpers.buildCondition)({
      aggType,
      thresholdComparator,
      hasTermsAgg,
      threshold
    }),
    transform: (0, _serialization_helpers.buildTransform)({
      aggType,
      thresholdComparator,
      hasTermsAgg,
      threshold
    }),
    actions: (0, _serialization_helpers.buildActions)(actions)
  };

  if (includeMetadata) {
    serializedWatch.metadata = {
      xpack: {
        type: _constants.WATCH_TYPES.THRESHOLD
      },
      ...(0, _serialization_helpers.buildMetadata)({
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
      })
    };

    if (name) {
      serializedWatch.metadata.name = name;
    }
  }

  return serializedWatch;
}