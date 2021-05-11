"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIMELINES_PAGE = exports.OVERVIEW_PAGE = exports.NETWORK_PAGE = exports.ADMINISTRATION_PAGE = exports.KIBANA_NAVIGATION_TOGGLE = exports.HOSTS_PAGE = exports.CASES_PAGE = exports.DETECTIONS_PAGE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DETECTIONS_PAGE = '[data-test-subj="collapsibleNavGroup-securitySolution"] [title="Detections"]';
exports.DETECTIONS_PAGE = DETECTIONS_PAGE;
const CASES_PAGE = '[data-test-subj="collapsibleNavGroup-securitySolution"] [title="Cases"]';
exports.CASES_PAGE = CASES_PAGE;
const HOSTS_PAGE = '[data-test-subj="collapsibleNavGroup-securitySolution"] [title="Hosts"]';
exports.HOSTS_PAGE = HOSTS_PAGE;
const KIBANA_NAVIGATION_TOGGLE = '[data-test-subj="toggleNavButton"]';
exports.KIBANA_NAVIGATION_TOGGLE = KIBANA_NAVIGATION_TOGGLE;
const ADMINISTRATION_PAGE = '[data-test-subj="collapsibleNavGroup-securitySolution"] [title="Administration"]';
exports.ADMINISTRATION_PAGE = ADMINISTRATION_PAGE;
const NETWORK_PAGE = '[data-test-subj="collapsibleNavGroup-securitySolution"] [title="Network"]';
exports.NETWORK_PAGE = NETWORK_PAGE;
const OVERVIEW_PAGE = '[data-test-subj="collapsibleNavGroup-securitySolution"] [title="Overview"]';
exports.OVERVIEW_PAGE = OVERVIEW_PAGE;
const TIMELINES_PAGE = '[data-test-subj="collapsibleNavGroup-securitySolution"] [title="Timelines"]';
exports.TIMELINES_PAGE = TIMELINES_PAGE;