"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INSPECT_NETWORK_BUTTONS_IN_SECURITY = exports.INSPECT_HOSTS_BUTTONS_IN_SECURITY = exports.INSPECT_MODAL = exports.INSPECT_BUTTON_ICON = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INSPECT_BUTTON_ICON = '[data-test-subj="inspect-icon-button"]';
exports.INSPECT_BUTTON_ICON = INSPECT_BUTTON_ICON;
const INSPECT_MODAL = '[data-test-subj="modal-inspect-euiModal"]';
exports.INSPECT_MODAL = INSPECT_MODAL;
const INSPECT_HOSTS_BUTTONS_IN_SECURITY = [{
  id: '[data-test-subj="stat-hosts"]',
  title: 'Hosts Stat'
}, {
  id: '[data-test-subj="stat-authentication"]',
  title: 'User Authentications Stat'
}, {
  id: '[data-test-subj="stat-uniqueIps"]',
  title: 'Unique IPs Stat'
}, {
  id: '[data-test-subj="table-allHosts-loading-false"]',
  title: 'All Hosts Table',
  tabId: '[data-test-subj="navigation-allHosts"]'
}, {
  id: '[data-test-subj="table-authentications-loading-false"]',
  title: 'Authentications Table',
  tabId: '[data-test-subj="navigation-authentications"]'
}, {
  id: '[data-test-subj="table-uncommonProcesses-loading-false"]',
  title: 'Uncommon processes Table',
  tabId: '[data-test-subj="navigation-uncommonProcesses"]'
}, {
  altInspectId: `[data-test-subj="events-viewer-panel"] ${INSPECT_BUTTON_ICON}`,
  id: '[data-test-subj="events-container-loading-false"]',
  title: 'Events Table',
  tabId: '[data-test-subj="navigation-events"]'
}];
exports.INSPECT_HOSTS_BUTTONS_IN_SECURITY = INSPECT_HOSTS_BUTTONS_IN_SECURITY;
const INSPECT_NETWORK_BUTTONS_IN_SECURITY = [{
  id: '[data-test-subj="stat-networkEvents"]',
  title: 'Network events Stat'
}, {
  id: '[data-test-subj="stat-dnsQueries"]',
  title: 'DNS queries Stat'
}, {
  id: '[data-test-subj="stat-uniqueFlowId"]',
  title: 'Unique flow IDs Stat'
}, {
  id: '[data-test-subj="stat-tlsHandshakes"]',
  title: 'TLS handshakes Stat'
}, {
  id: '[data-test-subj="stat-UniqueIps"]',
  title: 'Unique private IPs Stat'
}, {
  id: '[data-test-subj="table-topNFlowSource-loading-false"]',
  title: 'Source IPs Table'
}, {
  id: '[data-test-subj="table-topNFlowDestination-loading-false"]',
  title: 'Destination IPs Table'
}, {
  id: '[data-test-subj="table-dns-loading-false"]',
  title: 'Top DNS Domains Table',
  tabId: '[data-test-subj="navigation-dns"]'
}];
exports.INSPECT_NETWORK_BUTTONS_IN_SECURITY = INSPECT_NETWORK_BUTTONS_IN_SECURITY;