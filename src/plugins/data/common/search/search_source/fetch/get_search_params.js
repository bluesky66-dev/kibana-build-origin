"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchParams = getSearchParams;
exports.getPreference = getPreference;
exports.getSearchParamsFromRequest = getSearchParamsFromRequest;

var _constants = require("../../../constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const sessionId = Date.now();

function getSearchParams(getConfig) {
  return {
    preference: getPreference(getConfig)
  };
}

function getPreference(getConfig) {
  const setRequestPreference = getConfig(_constants.UI_SETTINGS.COURIER_SET_REQUEST_PREFERENCE);
  if (setRequestPreference === 'sessionId') return sessionId;
  return setRequestPreference === 'custom' ? getConfig(_constants.UI_SETTINGS.COURIER_CUSTOM_REQUEST_PREFERENCE) : undefined;
}
/** @public */
// TODO: Could provide this on runtime contract with dependencies
// already wired up.


function getSearchParamsFromRequest(searchRequest, dependencies) {
  const {
    getConfig
  } = dependencies;
  const searchParams = getSearchParams(getConfig); // eslint-disable-next-line @typescript-eslint/naming-convention

  const {
    track_total_hits,
    ...body
  } = searchRequest.body;
  return {
    index: searchRequest.index.title || searchRequest.index,
    body,
    track_total_hits,
    ...searchParams
  };
}