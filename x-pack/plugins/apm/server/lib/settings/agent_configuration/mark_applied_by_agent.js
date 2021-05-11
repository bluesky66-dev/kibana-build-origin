"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markAppliedByAgent = markAppliedByAgent;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// We're not wrapping this function with a span as it is not blocking the request

async function markAppliedByAgent({
  id,
  body,
  setup
}) {
  const {
    internalClient,
    indices
  } = setup;
  const params = {
    index: indices.apmAgentConfigurationIndex,
    id,
    // by specifying the `id` elasticsearch will do an "upsert"
    body: { ...body,
      applied_by_agent: true
    }
  };
  return internalClient.index(params);
}