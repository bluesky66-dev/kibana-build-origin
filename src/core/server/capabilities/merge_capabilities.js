"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeCapabilities = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const mergeCapabilities = (...sources) => (0, _lodash.mergeWith)({}, ...sources, (a, b) => {
  if (typeof a === 'boolean' && typeof b === 'object' || typeof a === 'object' && typeof b === 'boolean') {
    throw new Error(`conflict trying to merge boolean with object`);
  }

  if (typeof a === 'boolean' && typeof b === 'boolean' && a !== b) {
    throw new Error(`conflict trying to merge booleans with different values`);
  }
});

exports.mergeCapabilities = mergeCapabilities;