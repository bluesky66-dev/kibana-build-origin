"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrate712 = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Drop the previous document's attributes, which report `averageDuration` incorrectly.
 * @param doc
 */
const migrate712 = doc => {
  return { ...doc,
    attributes: {}
  };
};

exports.migrate712 = migrate712;