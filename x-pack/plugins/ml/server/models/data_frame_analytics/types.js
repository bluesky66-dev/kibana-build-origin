"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MapElements", {
  enumerable: true,
  get: function () {
    return _data_frame_analytics.MapElements;
  }
});
Object.defineProperty(exports, "AnalyticsMapReturnType", {
  enumerable: true,
  get: function () {
    return _data_frame_analytics.AnalyticsMapReturnType;
  }
});
Object.defineProperty(exports, "AnalyticsMapNodeElement", {
  enumerable: true,
  get: function () {
    return _data_frame_analytics.AnalyticsMapNodeElement;
  }
});
Object.defineProperty(exports, "AnalyticsMapEdgeElement", {
  enumerable: true,
  get: function () {
    return _data_frame_analytics.AnalyticsMapEdgeElement;
  }
});
exports.isTransformLinkReturnType = exports.isJobDataLinkReturnType = exports.isIndexPatternLinkReturnType = exports.isAnalyticsMapEdgeElement = exports.isAnalyticsMapNodeElement = exports.isCompleteInitialReturnType = void 0;

var _data_frame_analytics = require("../../../common/types/data_frame_analytics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isCompleteInitialReturnType = arg => {
  if (typeof arg !== 'object' || arg === null) return false;
  const keys = Object.keys(arg);
  return keys.length > 0 && keys.includes('nextLinkId') && arg.nextLinkId !== undefined && keys.includes('nextType') && arg.nextType !== undefined && keys.includes('previousNodeId') && arg.previousNodeId !== undefined;
};

exports.isCompleteInitialReturnType = isCompleteInitialReturnType;

const isAnalyticsMapNodeElement = arg => {
  if (typeof arg !== 'object' || arg === null) return false;
  const keys = Object.keys(arg);
  return keys.length > 0 && keys.includes('data') && arg.data.label !== undefined;
};

exports.isAnalyticsMapNodeElement = isAnalyticsMapNodeElement;

const isAnalyticsMapEdgeElement = arg => {
  if (typeof arg !== 'object' || arg === null) return false;
  const keys = Object.keys(arg);
  return keys.length > 0 && keys.includes('data') && arg.data.target !== undefined;
};

exports.isAnalyticsMapEdgeElement = isAnalyticsMapEdgeElement;

const isIndexPatternLinkReturnType = arg => {
  if (typeof arg !== 'object' || arg === null) return false;
  const keys = Object.keys(arg);
  return keys.length > 0 && keys.includes('isIndexPattern');
};

exports.isIndexPatternLinkReturnType = isIndexPatternLinkReturnType;

const isJobDataLinkReturnType = arg => {
  if (typeof arg !== 'object' || arg === null) return false;
  const keys = Object.keys(arg);
  return keys.length > 0 && keys.includes('isJob');
};

exports.isJobDataLinkReturnType = isJobDataLinkReturnType;

const isTransformLinkReturnType = arg => {
  if (typeof arg !== 'object' || arg === null) return false;
  const keys = Object.keys(arg);
  return keys.length > 0 && keys.includes('isTransform');
};

exports.isTransformLinkReturnType = isTransformLinkReturnType;