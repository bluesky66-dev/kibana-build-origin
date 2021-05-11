"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTypes = getTypes;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 *  Get the names of the types defined in the EsMappingsDsl
 */
function getTypes(mappings) {
  return Object.keys(mappings).filter(type => type !== '_default_');
}