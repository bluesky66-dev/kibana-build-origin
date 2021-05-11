"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAgentUpgradeable = isAgentUpgradeable;

var _coerce = _interopRequireDefault(require("semver/functions/coerce"));

var _lt = _interopRequireDefault(require("semver/functions/lt"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isAgentUpgradeable(agent, kibanaVersion) {
  var _agent$local_metadata, _agent$local_metadata2, _agent$local_metadata3;

  let agentVersion;

  if (typeof (agent === null || agent === void 0 ? void 0 : (_agent$local_metadata = agent.local_metadata) === null || _agent$local_metadata === void 0 ? void 0 : (_agent$local_metadata2 = _agent$local_metadata.elastic) === null || _agent$local_metadata2 === void 0 ? void 0 : (_agent$local_metadata3 = _agent$local_metadata2.agent) === null || _agent$local_metadata3 === void 0 ? void 0 : _agent$local_metadata3.version) === 'string') {
    agentVersion = agent.local_metadata.elastic.agent.version;
  } else {
    return false;
  }

  if (agent.unenrollment_started_at || agent.unenrolled_at) return false;
  if (!agent.local_metadata.elastic.agent.upgradeable) return false; // make sure versions are only the number before comparison

  const agentVersionNumber = (0, _coerce.default)(agentVersion);
  if (!agentVersionNumber) throw new Error('agent version is invalid');
  const kibanaVersionNumber = (0, _coerce.default)(kibanaVersion);
  if (!kibanaVersionNumber) throw new Error('kibana version is invalid');
  return (0, _lt.default)(agentVersionNumber, kibanaVersionNumber);
}