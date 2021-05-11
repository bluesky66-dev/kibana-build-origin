"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CALLOUT_DISMISS_BTN = exports.callOutWithId = exports.CALLOUT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CALLOUT = '[data-test-subj^="callout-"]';
exports.CALLOUT = CALLOUT;

const callOutWithId = id => `[data-test-subj="callout-${id}"]`;

exports.callOutWithId = callOutWithId;
const CALLOUT_DISMISS_BTN = '[data-test-subj^="callout-dismiss-"]';
exports.CALLOUT_DISMISS_BTN = CALLOUT_DISMISS_BTN;