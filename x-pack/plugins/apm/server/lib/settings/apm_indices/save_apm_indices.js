"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveApmIndices = saveApmIndices;

var _apm_saved_object_constants = require("../../../../common/apm_saved_object_constants");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function saveApmIndices(savedObjectsClient, apmIndices) {
  return (0, _with_apm_span.withApmSpan)('save_apm_indices', () => savedObjectsClient.create(_apm_saved_object_constants.APM_INDICES_SAVED_OBJECT_TYPE, removeEmpty(apmIndices), {
    id: _apm_saved_object_constants.APM_INDICES_SAVED_OBJECT_ID,
    overwrite: true
  }));
} // remove empty/undefined values


function removeEmpty(apmIndices) {
  return Object.entries(apmIndices).map(([key, value]) => [key, value === null || value === void 0 ? void 0 : value.trim()]).filter(([_, value]) => !!value).reduce((obj, [key, value]) => ({ ...obj,
    [key]: value
  }), {});
}