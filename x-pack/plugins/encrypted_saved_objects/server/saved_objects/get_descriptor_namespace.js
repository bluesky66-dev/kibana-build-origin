"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeNamespace = exports.getDescriptorNamespace = void 0;

var _server = require("../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getDescriptorNamespace = (typeRegistry, type, namespace) => {
  const descriptorNamespace = typeRegistry.isSingleNamespace(type) ? Array.isArray(namespace) ? namespace[0] : namespace : undefined;
  return normalizeNamespace(descriptorNamespace);
};
/**
 * Ensure that a namespace is always in its namespace ID representation.
 * This allows `'default'` to be used interchangeably with `undefined`.
 */


exports.getDescriptorNamespace = getDescriptorNamespace;

const normalizeNamespace = namespace => namespace === undefined ? namespace : _server.SavedObjectsUtils.namespaceStringToId(namespace);

exports.normalizeNamespace = normalizeNamespace;