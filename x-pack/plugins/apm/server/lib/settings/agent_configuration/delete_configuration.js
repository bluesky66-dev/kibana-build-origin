"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteConfiguration = deleteConfiguration;

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function deleteConfiguration({
  configurationId,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('delete_agent_configuration', async () => {
    const {
      internalClient,
      indices
    } = setup;
    const params = {
      refresh: 'wait_for',
      index: indices.apmAgentConfigurationIndex,
      id: configurationId
    };
    return internalClient.delete(params);
  });
}