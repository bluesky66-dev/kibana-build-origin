"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INSTALL_SCRIPT_API_ROUTES = exports.SETUP_API_ROUTE = exports.AGENTS_SETUP_API_ROUTES = exports.ENROLLMENT_API_KEY_ROUTES = exports.AGENT_API_ROUTES_7_9 = exports.AGENT_API_ROUTES = exports.APP_API_ROUTES = exports.SETTINGS_API_ROUTES = exports.OUTPUT_API_ROUTES = exports.AGENT_POLICY_API_ROUTES = exports.PACKAGE_POLICY_API_ROUTES = exports.DATA_STREAM_API_ROUTES = exports.EPM_API_ROUTES = exports.LIMITED_CONCURRENCY_ROUTE_TAG = exports.FLEET_API_ROOT_7_9 = exports.AGENT_POLICY_API_ROOT = exports.PACKAGE_POLICY_API_ROOT = exports.DATA_STREAM_API_ROOT = exports.EPM_API_ROOT = exports.API_ROOT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Base API paths

const API_ROOT = `/api/fleet`;
exports.API_ROOT = API_ROOT;
const EPM_API_ROOT = `${API_ROOT}/epm`;
exports.EPM_API_ROOT = EPM_API_ROOT;
const DATA_STREAM_API_ROOT = `${API_ROOT}/data_streams`;
exports.DATA_STREAM_API_ROOT = DATA_STREAM_API_ROOT;
const PACKAGE_POLICY_API_ROOT = `${API_ROOT}/package_policies`;
exports.PACKAGE_POLICY_API_ROOT = PACKAGE_POLICY_API_ROOT;
const AGENT_POLICY_API_ROOT = `${API_ROOT}/agent_policies`;
exports.AGENT_POLICY_API_ROOT = AGENT_POLICY_API_ROOT;
const FLEET_API_ROOT_7_9 = `/api/ingest_manager/fleet`;
exports.FLEET_API_ROOT_7_9 = FLEET_API_ROOT_7_9;
const LIMITED_CONCURRENCY_ROUTE_TAG = 'ingest:limited-concurrency'; // EPM API routes

exports.LIMITED_CONCURRENCY_ROUTE_TAG = LIMITED_CONCURRENCY_ROUTE_TAG;
const EPM_PACKAGES_MANY = `${EPM_API_ROOT}/packages`;
const EPM_PACKAGES_BULK = `${EPM_PACKAGES_MANY}/_bulk`;
const EPM_PACKAGES_ONE = `${EPM_PACKAGES_MANY}/{pkgkey}`;
const EPM_PACKAGES_FILE = `${EPM_PACKAGES_MANY}/{pkgName}/{pkgVersion}`;
const EPM_API_ROUTES = {
  BULK_INSTALL_PATTERN: EPM_PACKAGES_BULK,
  LIST_PATTERN: EPM_PACKAGES_MANY,
  LIMITED_LIST_PATTERN: `${EPM_PACKAGES_MANY}/limited`,
  INFO_PATTERN: EPM_PACKAGES_ONE,
  INSTALL_FROM_REGISTRY_PATTERN: EPM_PACKAGES_ONE,
  INSTALL_BY_UPLOAD_PATTERN: EPM_PACKAGES_MANY,
  DELETE_PATTERN: EPM_PACKAGES_ONE,
  FILEPATH_PATTERN: `${EPM_PACKAGES_FILE}/{filePath*}`,
  CATEGORIES_PATTERN: `${EPM_API_ROOT}/categories`,
  STATS_PATTERN: `${EPM_PACKAGES_MANY}/{pkgName}/stats`
}; // Data stream API routes

exports.EPM_API_ROUTES = EPM_API_ROUTES;
const DATA_STREAM_API_ROUTES = {
  LIST_PATTERN: `${DATA_STREAM_API_ROOT}`
}; // Package policy API routes

exports.DATA_STREAM_API_ROUTES = DATA_STREAM_API_ROUTES;
const PACKAGE_POLICY_API_ROUTES = {
  LIST_PATTERN: `${PACKAGE_POLICY_API_ROOT}`,
  INFO_PATTERN: `${PACKAGE_POLICY_API_ROOT}/{packagePolicyId}`,
  CREATE_PATTERN: `${PACKAGE_POLICY_API_ROOT}`,
  UPDATE_PATTERN: `${PACKAGE_POLICY_API_ROOT}/{packagePolicyId}`,
  DELETE_PATTERN: `${PACKAGE_POLICY_API_ROOT}/delete`
}; // Agent policy API routes

exports.PACKAGE_POLICY_API_ROUTES = PACKAGE_POLICY_API_ROUTES;
const AGENT_POLICY_API_ROUTES = {
  LIST_PATTERN: `${AGENT_POLICY_API_ROOT}`,
  INFO_PATTERN: `${AGENT_POLICY_API_ROOT}/{agentPolicyId}`,
  CREATE_PATTERN: `${AGENT_POLICY_API_ROOT}`,
  UPDATE_PATTERN: `${AGENT_POLICY_API_ROOT}/{agentPolicyId}`,
  COPY_PATTERN: `${AGENT_POLICY_API_ROOT}/{agentPolicyId}/copy`,
  DELETE_PATTERN: `${AGENT_POLICY_API_ROOT}/delete`,
  FULL_INFO_PATTERN: `${AGENT_POLICY_API_ROOT}/{agentPolicyId}/full`,
  FULL_INFO_DOWNLOAD_PATTERN: `${AGENT_POLICY_API_ROOT}/{agentPolicyId}/download`
}; // Output API routes

exports.AGENT_POLICY_API_ROUTES = AGENT_POLICY_API_ROUTES;
const OUTPUT_API_ROUTES = {
  LIST_PATTERN: `${API_ROOT}/outputs`,
  INFO_PATTERN: `${API_ROOT}/outputs/{outputId}`,
  UPDATE_PATTERN: `${API_ROOT}/outputs/{outputId}`
}; // Settings API routes

exports.OUTPUT_API_ROUTES = OUTPUT_API_ROUTES;
const SETTINGS_API_ROUTES = {
  INFO_PATTERN: `${API_ROOT}/settings`,
  UPDATE_PATTERN: `${API_ROOT}/settings`
}; // App API routes

exports.SETTINGS_API_ROUTES = SETTINGS_API_ROUTES;
const APP_API_ROUTES = {
  CHECK_PERMISSIONS_PATTERN: `${API_ROOT}/check-permissions`
}; // Agent API routes

exports.APP_API_ROUTES = APP_API_ROUTES;
const AGENT_API_ROUTES = {
  LIST_PATTERN: `${API_ROOT}/agents`,
  INFO_PATTERN: `${API_ROOT}/agents/{agentId}`,
  UPDATE_PATTERN: `${API_ROOT}/agents/{agentId}`,
  DELETE_PATTERN: `${API_ROOT}/agents/{agentId}`,
  EVENTS_PATTERN: `${API_ROOT}/agents/{agentId}/events`,
  CHECKIN_PATTERN: `${API_ROOT}/agents/{agentId}/checkin`,
  ACKS_PATTERN: `${API_ROOT}/agents/{agentId}/acks`,
  ACTIONS_PATTERN: `${API_ROOT}/agents/{agentId}/actions`,
  ENROLL_PATTERN: `${API_ROOT}/agents/enroll`,
  UNENROLL_PATTERN: `${API_ROOT}/agents/{agentId}/unenroll`,
  BULK_UNENROLL_PATTERN: `${API_ROOT}/agents/bulk_unenroll`,
  REASSIGN_PATTERN: `${API_ROOT}/agents/{agentId}/reassign`,
  BULK_REASSIGN_PATTERN: `${API_ROOT}/agents/bulk_reassign`,
  STATUS_PATTERN: `${API_ROOT}/agent-status`,
  UPGRADE_PATTERN: `${API_ROOT}/agents/{agentId}/upgrade`,
  BULK_UPGRADE_PATTERN: `${API_ROOT}/agents/bulk_upgrade`
};
exports.AGENT_API_ROUTES = AGENT_API_ROUTES;
const AGENT_API_ROUTES_7_9 = {
  CHECKIN_PATTERN: `${FLEET_API_ROOT_7_9}/agents/{agentId}/checkin`,
  ACKS_PATTERN: `${FLEET_API_ROOT_7_9}/agents/{agentId}/acks`,
  ENROLL_PATTERN: `${FLEET_API_ROOT_7_9}/agents/enroll`
};
exports.AGENT_API_ROUTES_7_9 = AGENT_API_ROUTES_7_9;
const ENROLLMENT_API_KEY_ROUTES = {
  CREATE_PATTERN: `${API_ROOT}/enrollment-api-keys`,
  LIST_PATTERN: `${API_ROOT}/enrollment-api-keys`,
  INFO_PATTERN: `${API_ROOT}/enrollment-api-keys/{keyId}`,
  DELETE_PATTERN: `${API_ROOT}/enrollment-api-keys/{keyId}`
}; // Agents setup API routes

exports.ENROLLMENT_API_KEY_ROUTES = ENROLLMENT_API_KEY_ROUTES;
const AGENTS_SETUP_API_ROUTES = {
  INFO_PATTERN: `${API_ROOT}/agents/setup`,
  CREATE_PATTERN: `${API_ROOT}/agents/setup`
};
exports.AGENTS_SETUP_API_ROUTES = AGENTS_SETUP_API_ROUTES;
const SETUP_API_ROUTE = `${API_ROOT}/setup`;
exports.SETUP_API_ROUTE = SETUP_API_ROUTE;
const INSTALL_SCRIPT_API_ROUTES = `${API_ROOT}/install/{osType}`;
exports.INSTALL_SCRIPT_API_ROUTES = INSTALL_SCRIPT_API_ROUTES;