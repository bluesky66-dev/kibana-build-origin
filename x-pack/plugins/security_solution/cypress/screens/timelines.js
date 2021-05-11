"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIMELINES_USERNAME = exports.TIMELINES_TABLE = exports.TIMELINES_PINNED_EVENT_COUNT = exports.TIMELINES_NOTES_COUNT = exports.TIMELINES_DESCRIPTION = exports.TIMELINES_FAVORITE = exports.TIMELINE_CHECKBOX = exports.TIMELINE = exports.EXPORT_TIMELINE_ACTION = exports.BULK_ACTIONS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BULK_ACTIONS = '[data-test-subj="utility-bar-action-button"]';
exports.BULK_ACTIONS = BULK_ACTIONS;
const EXPORT_TIMELINE_ACTION = '[data-test-subj="export-timeline-action"]';
exports.EXPORT_TIMELINE_ACTION = EXPORT_TIMELINE_ACTION;

const TIMELINE = id => {
  return `[data-test-subj="title-${id}"]`;
};

exports.TIMELINE = TIMELINE;

const TIMELINE_CHECKBOX = id => {
  return `[data-test-subj="checkboxSelectRow-${id}"]`;
};

exports.TIMELINE_CHECKBOX = TIMELINE_CHECKBOX;
const TIMELINES_FAVORITE = '[data-test-subj="favorite-starFilled-star"]';
exports.TIMELINES_FAVORITE = TIMELINES_FAVORITE;
const TIMELINES_DESCRIPTION = '[data-test-subj="description"]';
exports.TIMELINES_DESCRIPTION = TIMELINES_DESCRIPTION;
const TIMELINES_NOTES_COUNT = '[data-test-subj="notes-count"]';
exports.TIMELINES_NOTES_COUNT = TIMELINES_NOTES_COUNT;
const TIMELINES_PINNED_EVENT_COUNT = '[data-test-subj="pinned-event-count"]';
exports.TIMELINES_PINNED_EVENT_COUNT = TIMELINES_PINNED_EVENT_COUNT;
const TIMELINES_TABLE = '[data-test-subj="timelines-table"]';
exports.TIMELINES_TABLE = TIMELINES_TABLE;
const TIMELINES_USERNAME = '[data-test-subj="username"]';
exports.TIMELINES_USERNAME = TIMELINES_USERNAME;