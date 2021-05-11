"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OVERVIEW_EMPTY_PAGE = exports.OVERVIEW_NETWORK_STATS = exports.OVERVIEW_HOST_STATS = exports.NETWORK_STATS = exports.STAT_TLS = exports.STAT_FLOW = exports.STAT_DNS = exports.STAT_ZEEK = exports.STAT_SURICATA = exports.STAT_PANW = exports.STAT_NETFLOW = exports.STAT_CISCO = exports.STAT_SOCKET = exports.HOST_STATS = exports.STAT_WINLOGBEAT_MWSYSMON_OPERATIONAL = exports.STAT_WINLOGBEAT_SECURITY = exports.STAT_USER = exports.STAT_PROCESS = exports.STAT_PACKAGE = exports.STAT_LOGIN = exports.STAT_FIM = exports.STAT_FILEBEAT = exports.ENDGAME_SECURITY = exports.ENDGAME_REGISTRY = exports.ENDGAME_PROCESS = exports.ENDGAME_NETWORK = exports.ENDGAME_IMAGE_LOAD = exports.ENDGAME_FILE = exports.ENDGAME_DNS = exports.STAT_AUDITD = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Host Stats

const STAT_AUDITD = {
  value: '123',
  domId: '[data-test-subj="host-stat-auditbeatAuditd"]'
};
exports.STAT_AUDITD = STAT_AUDITD;
const ENDGAME_DNS = {
  value: '391',
  domId: '[data-test-subj="host-stat-endgameDns"]'
};
exports.ENDGAME_DNS = ENDGAME_DNS;
const ENDGAME_FILE = {
  value: '392',
  domId: '[data-test-subj="host-stat-endgameFile"]'
};
exports.ENDGAME_FILE = ENDGAME_FILE;
const ENDGAME_IMAGE_LOAD = {
  value: '393',
  domId: '[data-test-subj="host-stat-endgameImageLoad"]'
};
exports.ENDGAME_IMAGE_LOAD = ENDGAME_IMAGE_LOAD;
const ENDGAME_NETWORK = {
  value: '394',
  domId: '[data-test-subj="host-stat-endgameNetwork"]'
};
exports.ENDGAME_NETWORK = ENDGAME_NETWORK;
const ENDGAME_PROCESS = {
  value: '395',
  domId: '[data-test-subj="host-stat-endgameProcess"]'
};
exports.ENDGAME_PROCESS = ENDGAME_PROCESS;
const ENDGAME_REGISTRY = {
  value: '396',
  domId: '[data-test-subj="host-stat-endgameRegistry"]'
};
exports.ENDGAME_REGISTRY = ENDGAME_REGISTRY;
const ENDGAME_SECURITY = {
  value: '397',
  domId: '[data-test-subj="host-stat-endgameSecurity"]'
};
exports.ENDGAME_SECURITY = ENDGAME_SECURITY;
const STAT_FILEBEAT = {
  value: '890',
  domId: '[data-test-subj="host-stat-filebeatSystemModule"]'
};
exports.STAT_FILEBEAT = STAT_FILEBEAT;
const STAT_FIM = {
  value: '345',
  domId: '[data-test-subj="host-stat-auditbeatFIM"]'
};
exports.STAT_FIM = STAT_FIM;
const STAT_LOGIN = {
  value: '456',
  domId: '[data-test-subj="host-stat-auditbeatLogin"]'
};
exports.STAT_LOGIN = STAT_LOGIN;
const STAT_PACKAGE = {
  value: '567',
  domId: '[data-test-subj="host-stat-auditbeatPackage"]'
};
exports.STAT_PACKAGE = STAT_PACKAGE;
const STAT_PROCESS = {
  value: '678',
  domId: '[data-test-subj="host-stat-auditbeatProcess"]'
};
exports.STAT_PROCESS = STAT_PROCESS;
const STAT_USER = {
  value: '789',
  domId: '[data-test-subj="host-stat-auditbeatUser"]'
};
exports.STAT_USER = STAT_USER;
const STAT_WINLOGBEAT_SECURITY = {
  value: '70',
  domId: '[data-test-subj="host-stat-winlogbeatSecurity"]'
};
exports.STAT_WINLOGBEAT_SECURITY = STAT_WINLOGBEAT_SECURITY;
const STAT_WINLOGBEAT_MWSYSMON_OPERATIONAL = {
  value: '30',
  domId: '[data-test-subj="host-stat-winlogbeatMWSysmonOperational"]'
};
exports.STAT_WINLOGBEAT_MWSYSMON_OPERATIONAL = STAT_WINLOGBEAT_MWSYSMON_OPERATIONAL;
const HOST_STATS = [STAT_AUDITD, ENDGAME_DNS, ENDGAME_FILE, ENDGAME_IMAGE_LOAD, ENDGAME_NETWORK, ENDGAME_PROCESS, ENDGAME_REGISTRY, ENDGAME_SECURITY, STAT_FILEBEAT, STAT_FIM, STAT_LOGIN, STAT_PACKAGE, STAT_PROCESS, STAT_USER, STAT_WINLOGBEAT_SECURITY, STAT_WINLOGBEAT_MWSYSMON_OPERATIONAL]; // Network Stats

exports.HOST_STATS = HOST_STATS;
const STAT_SOCKET = {
  value: '578,502',
  domId: '[data-test-subj="network-stat-auditbeatSocket"]'
};
exports.STAT_SOCKET = STAT_SOCKET;
const STAT_CISCO = {
  value: '999',
  domId: '[data-test-subj="network-stat-filebeatCisco"]'
};
exports.STAT_CISCO = STAT_CISCO;
const STAT_NETFLOW = {
  value: '2,544',
  domId: '[data-test-subj="network-stat-filebeatNetflow"]'
};
exports.STAT_NETFLOW = STAT_NETFLOW;
const STAT_PANW = {
  value: '678',
  domId: '[data-test-subj="network-stat-filebeatPanw"]'
};
exports.STAT_PANW = STAT_PANW;
const STAT_SURICATA = {
  value: '303,699',
  domId: '[data-test-subj="network-stat-filebeatSuricata"]'
};
exports.STAT_SURICATA = STAT_SURICATA;
const STAT_ZEEK = {
  value: '71,129',
  domId: '[data-test-subj="network-stat-filebeatZeek"]'
};
exports.STAT_ZEEK = STAT_ZEEK;
const STAT_DNS = {
  value: '1,090',
  domId: '[data-test-subj="network-stat-packetbeatDNS"]'
};
exports.STAT_DNS = STAT_DNS;
const STAT_FLOW = {
  value: '722,153',
  domId: '[data-test-subj="network-stat-packetbeatFlow"]'
};
exports.STAT_FLOW = STAT_FLOW;
const STAT_TLS = {
  value: '340',
  domId: '[data-test-subj="network-stat-packetbeatTLS"]'
};
exports.STAT_TLS = STAT_TLS;
const NETWORK_STATS = [STAT_SOCKET, STAT_CISCO, STAT_NETFLOW, STAT_PANW, STAT_SURICATA, STAT_ZEEK, STAT_DNS, STAT_FLOW, STAT_TLS];
exports.NETWORK_STATS = NETWORK_STATS;
const OVERVIEW_HOST_STATS = '[data-test-subj="overview-hosts-stats"]';
exports.OVERVIEW_HOST_STATS = OVERVIEW_HOST_STATS;
const OVERVIEW_NETWORK_STATS = '[data-test-subj="overview-network-stats"]';
exports.OVERVIEW_NETWORK_STATS = OVERVIEW_NETWORK_STATS;
const OVERVIEW_EMPTY_PAGE = '[data-test-subj="empty-page"]';
exports.OVERVIEW_EMPTY_PAGE = OVERVIEW_EMPTY_PAGE;