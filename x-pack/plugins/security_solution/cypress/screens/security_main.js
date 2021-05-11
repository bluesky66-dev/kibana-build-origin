"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIMELINE_BOTTOM_BAR_TOGGLE_BUTTON = exports.TIMELINE_TOGGLE_BUTTON = exports.MAIN_PAGE = exports.CLOSE_TIMELINE_BUTTON = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CLOSE_TIMELINE_BUTTON = '[data-test-subj="close-timeline"]';
exports.CLOSE_TIMELINE_BUTTON = CLOSE_TIMELINE_BUTTON;
const MAIN_PAGE = '[data-test-subj="kibanaChrome"]';
exports.MAIN_PAGE = MAIN_PAGE;
const TIMELINE_TOGGLE_BUTTON = '[data-test-subj="flyoutOverlay"]';
exports.TIMELINE_TOGGLE_BUTTON = TIMELINE_TOGGLE_BUTTON;
const TIMELINE_BOTTOM_BAR_TOGGLE_BUTTON = `[data-test-subj="flyoutBottomBar"] ${TIMELINE_TOGGLE_BUTTON}`;
exports.TIMELINE_BOTTOM_BAR_TOGGLE_BUTTON = TIMELINE_BOTTOM_BAR_TOGGLE_BUTTON;