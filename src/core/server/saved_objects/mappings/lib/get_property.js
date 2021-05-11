"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProperty = getProperty;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getPropertyMappingFromObjectMapping(mapping, path) {
  const props = mapping && mapping.properties || mapping && mapping.fields;

  if (!props) {
    return undefined;
  }

  if (path.length > 1) {
    return getPropertyMappingFromObjectMapping(props[path[0]], path.slice(1));
  } else {
    return props[path[0]];
  }
}

function getProperty(mappings, path) {
  return getPropertyMappingFromObjectMapping(mappings, (0, _lodash.toPath)(path));
}