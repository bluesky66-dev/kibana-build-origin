"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EVENTS = exports.ACTIONS_PANEL_ID = exports.ADDON_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ADDON_ID = 'kbn-canvas/redux-actions';
exports.ADDON_ID = ADDON_ID;
const ACTIONS_PANEL_ID = `${ADDON_ID}/panel`;
exports.ACTIONS_PANEL_ID = ACTIONS_PANEL_ID;
const RESULT = `${ADDON_ID}/result`;
const REQUEST = `${ADDON_ID}/request`;
const ACTION = `${ADDON_ID}/action`;
const RESET = `${ADDON_ID}/reset`;
const EVENTS = {
  ACTION,
  RESULT,
  REQUEST,
  RESET
};
exports.EVENTS = EVENTS;