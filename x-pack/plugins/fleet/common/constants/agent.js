"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AGENT_ACTIONS_INDEX = exports.AGENTS_INDEX = exports.AGENT_POLICY_ROLLOUT_RATE_LIMIT_REQUEST_PER_INTERVAL = exports.AGENT_POLICY_ROLLOUT_RATE_LIMIT_INTERVAL_MS = exports.AGENT_UPDATE_ACTIONS_INTERVAL_MS = exports.AGENT_UPDATE_LAST_CHECKIN_INTERVAL_MS = exports.AGENT_POLLING_INTERVAL = exports.AGENT_POLLING_THRESHOLD_MS = exports.AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS = exports.AGENT_POLLING_REQUEST_TIMEOUT_MS = exports.AGENT_TYPE_TEMPORARY = exports.AGENT_TYPE_EPHEMERAL = exports.AGENT_TYPE_PERMANENT = exports.AGENT_ACTION_SAVED_OBJECT_TYPE = exports.AGENT_EVENT_SAVED_OBJECT_TYPE = exports.AGENT_SAVED_OBJECT_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const AGENT_SAVED_OBJECT_TYPE = 'fleet-agents'; // TODO: Remove this saved object type. Core will drop any saved objects of
// this type during migrations. See https://github.com/elastic/kibana/issues/91869

exports.AGENT_SAVED_OBJECT_TYPE = AGENT_SAVED_OBJECT_TYPE;
const AGENT_EVENT_SAVED_OBJECT_TYPE = 'fleet-agent-events';
exports.AGENT_EVENT_SAVED_OBJECT_TYPE = AGENT_EVENT_SAVED_OBJECT_TYPE;
const AGENT_ACTION_SAVED_OBJECT_TYPE = 'fleet-agent-actions';
exports.AGENT_ACTION_SAVED_OBJECT_TYPE = AGENT_ACTION_SAVED_OBJECT_TYPE;
const AGENT_TYPE_PERMANENT = 'PERMANENT';
exports.AGENT_TYPE_PERMANENT = AGENT_TYPE_PERMANENT;
const AGENT_TYPE_EPHEMERAL = 'EPHEMERAL';
exports.AGENT_TYPE_EPHEMERAL = AGENT_TYPE_EPHEMERAL;
const AGENT_TYPE_TEMPORARY = 'TEMPORARY';
exports.AGENT_TYPE_TEMPORARY = AGENT_TYPE_TEMPORARY;
const AGENT_POLLING_REQUEST_TIMEOUT_MS = 300000; // 5 minutes

exports.AGENT_POLLING_REQUEST_TIMEOUT_MS = AGENT_POLLING_REQUEST_TIMEOUT_MS;
const AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS = 20000; // 20s

exports.AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS = AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS;
const AGENT_POLLING_THRESHOLD_MS = 30000;
exports.AGENT_POLLING_THRESHOLD_MS = AGENT_POLLING_THRESHOLD_MS;
const AGENT_POLLING_INTERVAL = 1000;
exports.AGENT_POLLING_INTERVAL = AGENT_POLLING_INTERVAL;
const AGENT_UPDATE_LAST_CHECKIN_INTERVAL_MS = 30000;
exports.AGENT_UPDATE_LAST_CHECKIN_INTERVAL_MS = AGENT_UPDATE_LAST_CHECKIN_INTERVAL_MS;
const AGENT_UPDATE_ACTIONS_INTERVAL_MS = 5000;
exports.AGENT_UPDATE_ACTIONS_INTERVAL_MS = AGENT_UPDATE_ACTIONS_INTERVAL_MS;
const AGENT_POLICY_ROLLOUT_RATE_LIMIT_INTERVAL_MS = 1000;
exports.AGENT_POLICY_ROLLOUT_RATE_LIMIT_INTERVAL_MS = AGENT_POLICY_ROLLOUT_RATE_LIMIT_INTERVAL_MS;
const AGENT_POLICY_ROLLOUT_RATE_LIMIT_REQUEST_PER_INTERVAL = 5;
exports.AGENT_POLICY_ROLLOUT_RATE_LIMIT_REQUEST_PER_INTERVAL = AGENT_POLICY_ROLLOUT_RATE_LIMIT_REQUEST_PER_INTERVAL;
const AGENTS_INDEX = '.fleet-agents';
exports.AGENTS_INDEX = AGENTS_INDEX;
const AGENT_ACTIONS_INDEX = '.fleet-actions';
exports.AGENT_ACTIONS_INDEX = AGENT_ACTIONS_INDEX;