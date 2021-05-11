"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENTS_VIEWER_PAGINATION = exports.SERVER_SIDE_EVENT_COUNT = exports.LOAD_MORE = exports.INSPECT_QUERY = exports.INSPECT_MODAL = exports.HOST_GEO_COUNTRY_NAME_HEADER = exports.HOST_GEO_COUNTRY_NAME_CHECKBOX = exports.HOST_GEO_CITY_NAME_HEADER = exports.HOST_GEO_CITY_NAME_CHECKBOX = exports.HEADER_SUBTITLE = exports.FIELDS_BROWSER_CONTAINER = exports.EVENTS_VIEWER_PANEL = exports.EVENTS_VIEWER_FIELDS_BUTTON = exports.CLOSE_MODAL = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CLOSE_MODAL = '[data-test-subj="modal-inspect-close"]';
exports.CLOSE_MODAL = CLOSE_MODAL;
const EVENTS_VIEWER_FIELDS_BUTTON = '[data-test-subj="events-viewer-panel"] [data-test-subj="show-field-browser"]';
exports.EVENTS_VIEWER_FIELDS_BUTTON = EVENTS_VIEWER_FIELDS_BUTTON;
const EVENTS_VIEWER_PANEL = '[data-test-subj="events-viewer-panel"]';
exports.EVENTS_VIEWER_PANEL = EVENTS_VIEWER_PANEL;
const FIELDS_BROWSER_CONTAINER = '[data-test-subj="fields-browser-container"]';
exports.FIELDS_BROWSER_CONTAINER = FIELDS_BROWSER_CONTAINER;
const HEADER_SUBTITLE = '[data-test-subj="events-viewer-panel"] [data-test-subj="header-panel-subtitle"]';
exports.HEADER_SUBTITLE = HEADER_SUBTITLE;
const HOST_GEO_CITY_NAME_CHECKBOX = '[data-test-subj="field-host.geo.city_name-checkbox"]';
exports.HOST_GEO_CITY_NAME_CHECKBOX = HOST_GEO_CITY_NAME_CHECKBOX;
const HOST_GEO_CITY_NAME_HEADER = '[data-test-subj="header-text-host.geo.city_name"]';
exports.HOST_GEO_CITY_NAME_HEADER = HOST_GEO_CITY_NAME_HEADER;
const HOST_GEO_COUNTRY_NAME_CHECKBOX = '[data-test-subj="field-host.geo.country_name-checkbox"]';
exports.HOST_GEO_COUNTRY_NAME_CHECKBOX = HOST_GEO_COUNTRY_NAME_CHECKBOX;
const HOST_GEO_COUNTRY_NAME_HEADER = '[data-test-subj="header-text-host.geo.country_name"]';
exports.HOST_GEO_COUNTRY_NAME_HEADER = HOST_GEO_COUNTRY_NAME_HEADER;
const INSPECT_MODAL = '[data-test-subj="modal-inspect-euiModal"]';
exports.INSPECT_MODAL = INSPECT_MODAL;
const INSPECT_QUERY = '[data-test-subj="events-viewer-panel"] [data-test-subj="inspect-icon-button"]';
exports.INSPECT_QUERY = INSPECT_QUERY;
const LOAD_MORE = '[data-test-subj="events-viewer-panel"] [data-test-subj="TimelineMoreButton"';
exports.LOAD_MORE = LOAD_MORE;
const SERVER_SIDE_EVENT_COUNT = '[data-test-subj="server-side-event-count"]';
exports.SERVER_SIDE_EVENT_COUNT = SERVER_SIDE_EVENT_COUNT;
const EVENTS_VIEWER_PAGINATION = '[data-test-subj="events-viewer-panel"] [data-test-subj="timeline-pagination"]';
exports.EVENTS_VIEWER_PAGINATION = EVENTS_VIEWER_PAGINATION;