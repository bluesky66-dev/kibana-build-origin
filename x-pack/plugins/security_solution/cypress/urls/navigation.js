"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIMELINE_TEMPLATES_URL = exports.TIMELINES_URL = exports.RULE_CREATION = exports.OVERVIEW_URL = exports.NETWORK_URL = exports.ADMINISTRATION_URL = exports.KIBANA_HOME = exports.HOSTS_PAGE_TAB_URLS = exports.HOSTS_URL = exports.DETECTIONS = exports.CASES_URL = exports.detectionsRuleDetailsUrl = exports.DETECTIONS_RULE_MANAGEMENT_URL = exports.DETECTIONS_URL = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DETECTIONS_URL = 'app/security/detections';
exports.DETECTIONS_URL = DETECTIONS_URL;
const DETECTIONS_RULE_MANAGEMENT_URL = 'app/security/detections/rules';
exports.DETECTIONS_RULE_MANAGEMENT_URL = DETECTIONS_RULE_MANAGEMENT_URL;

const detectionsRuleDetailsUrl = ruleId => `app/security/detections/rules/id/${ruleId}`;

exports.detectionsRuleDetailsUrl = detectionsRuleDetailsUrl;
const CASES_URL = '/app/security/cases';
exports.CASES_URL = CASES_URL;
const DETECTIONS = '/app/siem#/detections';
exports.DETECTIONS = DETECTIONS;
const HOSTS_URL = '/app/security/hosts/allHosts';
exports.HOSTS_URL = HOSTS_URL;
const HOSTS_PAGE_TAB_URLS = {
  allHosts: '/app/security/hosts/allHosts',
  anomalies: '/app/security/hosts/anomalies',
  authentications: '/app/security/hosts/authentications',
  events: '/app/security/hosts/events',
  uncommonProcesses: '/app/security/hosts/uncommonProcesses'
};
exports.HOSTS_PAGE_TAB_URLS = HOSTS_PAGE_TAB_URLS;
const KIBANA_HOME = '/app/home#/';
exports.KIBANA_HOME = KIBANA_HOME;
const ADMINISTRATION_URL = '/app/security/administration';
exports.ADMINISTRATION_URL = ADMINISTRATION_URL;
const NETWORK_URL = '/app/security/network';
exports.NETWORK_URL = NETWORK_URL;
const OVERVIEW_URL = '/app/security/overview';
exports.OVERVIEW_URL = OVERVIEW_URL;
const RULE_CREATION = 'app/security/detections/rules/create';
exports.RULE_CREATION = RULE_CREATION;
const TIMELINES_URL = '/app/security/timelines';
exports.TIMELINES_URL = TIMELINES_URL;
const TIMELINE_TEMPLATES_URL = '/app/security/timelines/template';
exports.TIMELINE_TEMPLATES_URL = TIMELINE_TEMPLATES_URL;