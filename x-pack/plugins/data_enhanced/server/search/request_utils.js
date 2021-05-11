"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIgnoreThrottled = getIgnoreThrottled;
exports.getDefaultAsyncSubmitParams = getDefaultAsyncSubmitParams;
exports.getDefaultAsyncGetParams = getDefaultAsyncGetParams;

var _common = require("../../../../../src/plugins/data/common");

var _server = require("../../../../../src/plugins/data/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @internal
 */


async function getIgnoreThrottled(uiSettingsClient) {
  const includeFrozen = await uiSettingsClient.get(_common.UI_SETTINGS.SEARCH_INCLUDE_FROZEN);
  return {
    ignore_throttled: !includeFrozen
  };
}
/**
 @internal
 */


async function getDefaultAsyncSubmitParams(uiSettingsClient, config, options) {
  return {
    batched_reduce_size: 64,
    keep_on_completion: !!options.sessionId,
    // Always return an ID, even if the request completes quickly
    ...getDefaultAsyncGetParams(options),
    ...(await getIgnoreThrottled(uiSettingsClient)),
    ...(await (0, _server.getDefaultSearchParams)(uiSettingsClient)),
    ...(options.sessionId ? {
      keep_alive: `${config.search.sessions.defaultExpiration.asMilliseconds()}ms`
    } : {})
  };
}
/**
 @internal
 */


function getDefaultAsyncGetParams(options) {
  return {
    wait_for_completion_timeout: '100ms',
    // Wait up to 100ms for the response to return
    ...(options.sessionId ? undefined : {
      keep_alive: '1m' // We still need to do polling for searches not within the context of a search session

    })
  };
}