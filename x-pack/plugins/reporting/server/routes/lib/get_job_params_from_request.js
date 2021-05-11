"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJobParamsFromRequest = getJobParamsFromRequest;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getJobParamsFromRequest(request) {
  const {
    savedObjectType,
    savedObjectId
  } = request.params;
  const {
    timerange,
    state
  } = request.body;
  const post = timerange || state ? {
    timerange,
    state
  } : undefined;
  return {
    savedObjectType,
    savedObjectId,
    post
  };
}