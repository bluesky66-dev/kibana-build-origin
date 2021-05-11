"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUpdateCustomLink = createOrUpdateCustomLink;

var _helper = require("./helper");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createOrUpdateCustomLink({
  customLinkId,
  customLink,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('create_or_update_custom_link', () => {
    const {
      internalClient,
      indices
    } = setup;
    const params = {
      refresh: true,
      index: indices.apmCustomLinkIndex,
      body: {
        '@timestamp': Date.now(),
        ...(0, _helper.toESFormat)(customLink)
      }
    }; // by specifying an id elasticsearch will delete the previous doc and insert the updated doc

    if (customLinkId) {
      params.id = customLinkId;
    }

    return internalClient.index(params);
  });
}