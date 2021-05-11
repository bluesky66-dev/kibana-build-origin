"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spaceIdToNamespace = spaceIdToNamespace;
exports.namespaceToSpaceId = namespaceToSpaceId;

var _server = require("../../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Converts a Space ID string to its namespace ID representation. Note that a Space ID string is equivalent to a namespace string.
 *
 * See also: {@link namespaceStringToId}.
 */


function spaceIdToNamespace(spaceId) {
  return _server.SavedObjectsUtils.namespaceStringToId(spaceId);
}
/**
 * Converts a namespace ID to its Space ID string representation. Note that a Space ID string is equivalent to a namespace string.
 *
 * See also: {@link namespaceIdToString}.
 */


function namespaceToSpaceId(namespace) {
  return _server.SavedObjectsUtils.namespaceIdToString(namespace);
}