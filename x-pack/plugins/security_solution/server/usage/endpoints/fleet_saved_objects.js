"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestFleetEndpointEvent = exports.getFleetSavedObjectsMetadata = exports.FLEET_ENDPOINT_PACKAGE_CONSTANT = void 0;

var _agent = require("./../../../../fleet/common/constants/agent");

var _common = require("../../../../fleet/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const FLEET_ENDPOINT_PACKAGE_CONSTANT = _common.defaultPackages.Endpoint;
exports.FLEET_ENDPOINT_PACKAGE_CONSTANT = FLEET_ENDPOINT_PACKAGE_CONSTANT;

const getFleetSavedObjectsMetadata = async savedObjectsClient => savedObjectsClient.find({
  // Get up to 10000 agents with endpoint installed
  type: _agent.AGENT_SAVED_OBJECT_TYPE,
  fields: ['packages', 'last_checkin', 'local_metadata.agent.id', 'local_metadata.host.id', 'local_metadata.host.name', 'local_metadata.host.hostname', 'local_metadata.elastic.agent.id', 'local_metadata.os'],
  filter: `${_agent.AGENT_SAVED_OBJECT_TYPE}.attributes.packages: ${FLEET_ENDPOINT_PACKAGE_CONSTANT}`,
  perPage: 10000,
  sortField: 'enrolled_at',
  sortOrder: 'desc'
});

exports.getFleetSavedObjectsMetadata = getFleetSavedObjectsMetadata;

const getLatestFleetEndpointEvent = async (savedObjectsClient, agentId) => savedObjectsClient.find({
  // Get the most recent endpoint event.
  type: _agent.AGENT_EVENT_SAVED_OBJECT_TYPE,
  fields: ['agent_id', 'subtype', 'payload'],
  filter: `${_agent.AGENT_EVENT_SAVED_OBJECT_TYPE}.attributes.message: "${FLEET_ENDPOINT_PACKAGE_CONSTANT}"`,
  perPage: 1,
  sortField: 'timestamp',
  sortOrder: 'desc',
  search: agentId,
  searchFields: ['agent_id']
});

exports.getLatestFleetEndpointEvent = getLatestFleetEndpointEvent;