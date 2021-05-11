"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.phaseToNodePreferenceMap = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Order of node roles matters here, the warm phase prefers allocating data
// to the data_warm role.

const WARM_PHASE_NODE_PREFERENCE = ['data_warm', 'data_hot'];
const COLD_PHASE_NODE_PREFERENCE = ['data_cold', 'data_warm', 'data_hot'];
const phaseToNodePreferenceMap = Object.freeze({
  warm: WARM_PHASE_NODE_PREFERENCE,
  cold: COLD_PHASE_NODE_PREFERENCE
});
exports.phaseToNodePreferenceMap = phaseToNodePreferenceMap;