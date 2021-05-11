"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCapabilitiesForRollupIndices = getCapabilitiesForRollupIndices;

var _jobs_compatibility = require("./jobs_compatibility");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getCapabilitiesForRollupIndices(indices) {
  const indexNames = Object.keys(indices);
  const capabilities = {};
  indexNames.forEach(index => {
    try {
      capabilities[index] = (0, _jobs_compatibility.mergeJobConfigurations)(indices[index].rollup_jobs);
    } catch (e) {
      capabilities[index] = {
        error: e.message
      };
    }
  });
  return capabilities;
}