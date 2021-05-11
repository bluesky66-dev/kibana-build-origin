"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInternalSavedObjectsClient = getInternalSavedObjectsClient;

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getInternalSavedObjectsClient(core) {
  return (0, _with_apm_span.withApmSpan)('get_internal_saved_objects_client', () => core.getStartServices().then(async ([coreStart]) => {
    return coreStart.savedObjects.createInternalRepository();
  }));
}