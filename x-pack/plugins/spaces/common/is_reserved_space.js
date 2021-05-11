"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isReservedSpace = isReservedSpace;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns whether the given Space is reserved or not.
 *
 * @param space the space
 * @returns boolean
 */


function isReservedSpace(space) {
  return (0, _lodash.get)(space, '_reserved', false);
}