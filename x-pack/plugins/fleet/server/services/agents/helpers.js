"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchHitToAgent = searchHitToAgent;
exports.agentSOAttributesToFleetServerAgentDoc = agentSOAttributesToFleetServerAgentDoc;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function searchHitToAgent(hit) {
  var _hit$_source$packages;

  return {
    id: hit._id,
    ...hit._source,
    policy_revision: hit._source.policy_revision_idx,
    current_error_events: [],
    access_api_key: undefined,
    status: undefined,
    packages: (_hit$_source$packages = hit._source.packages) !== null && _hit$_source$packages !== void 0 ? _hit$_source$packages : []
  };
}

function agentSOAttributesToFleetServerAgentDoc(data) {
  const {
    policy_revision: policyRevison,
    ...rest
  } = data;
  const doc = { ...rest
  };

  if (policyRevison !== undefined) {
    doc.policy_revision_idx = policyRevison;
  }

  return doc;
}