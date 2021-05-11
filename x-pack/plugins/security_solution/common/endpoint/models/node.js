"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeID = nodeID;
exports.parentId = parentId;
exports.timestampAsDate = timestampAsDate;
exports.nodeDataTimestamp = nodeDataTimestamp;
exports.nodeName = nodeName;

var _ecs_safety_helpers = require("./ecs_safety_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * These functions interact with the generic resolver node structure that does not define a specific format for the data
 * returned by Elasticsearch. These functions are similar to the events.ts model's function except that they do not
 * assume that the data will conform to a structure like an Endpoint or LegacyEndgame event.
 */

/**
 * @description - Extract the first non null value from the nodeID depending on the datasource. Returns
 * undefined if the field was never set.
 */


function nodeID(node) {
  return node !== null && node !== void 0 && node.id ? String((0, _ecs_safety_helpers.firstNonNullValue)(node.id)) : undefined;
}
/**
 * @description - Provides the parent for the given node
 */


function parentId(node) {
  return node !== null && node !== void 0 && node.parent ? String((0, _ecs_safety_helpers.firstNonNullValue)(node === null || node === void 0 ? void 0 : node.parent)) : undefined;
}
/**
 * The `@timestamp` for the event, as a `Date` object.
 * If `@timestamp` couldn't be parsed as a `Date`, returns `undefined`.
 */


function timestampAsDate(node) {
  const value = nodeDataTimestamp(node);

  if (value === undefined) {
    return undefined;
  }

  const date = new Date(value); // Check if the date is valid

  if (isFinite(date.getTime())) {
    return date;
  } else {
    return undefined;
  }
}
/**
 * Extracts the first non null value from the `@timestamp` field in the node data attribute.
 */


function nodeDataTimestamp(node) {
  return (0, _ecs_safety_helpers.firstNonNullValue)(node === null || node === void 0 ? void 0 : node.data['@timestamp']);
}
/**
 * @description - Extract the first non null value from the node name depending on the datasource. If it was never set
 * default to the ID, and if no ID, then undefined
 */


function nodeName(node) {
  return node !== null && node !== void 0 && node.name ? String((0, _ecs_safety_helpers.firstNonNullValue)(node.name)) : undefined;
}