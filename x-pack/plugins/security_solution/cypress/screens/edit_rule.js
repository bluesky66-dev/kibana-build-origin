"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KIBANA_LOADING_COMPLETE_INDICATOR = exports.KIBANA_LOADING_INDICATOR = exports.EDIT_SUBMIT_BUTTON = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EDIT_SUBMIT_BUTTON = '[data-test-subj="ruleEditSubmitButton"]';
exports.EDIT_SUBMIT_BUTTON = EDIT_SUBMIT_BUTTON;
const KIBANA_LOADING_INDICATOR = '[data-test-subj="globalLoadingIndicator"]';
exports.KIBANA_LOADING_INDICATOR = KIBANA_LOADING_INDICATOR;
const KIBANA_LOADING_COMPLETE_INDICATOR = '[data-test-subj="globalLoadingIndicator-hidden"]';
exports.KIBANA_LOADING_COMPLETE_INDICATOR = KIBANA_LOADING_COMPLETE_INDICATOR;