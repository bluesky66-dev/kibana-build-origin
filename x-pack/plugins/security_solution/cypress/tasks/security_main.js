"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openTimelineIfClosed = exports.closeTimelineUsingCloseButton = exports.closeTimelineUsingToggle = exports.openTimelineUsingToggle = void 0;

var _security_main = require("../screens/security_main");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const openTimelineUsingToggle = () => {
  cy.get(_security_main.TIMELINE_BOTTOM_BAR_TOGGLE_BUTTON).click();
};

exports.openTimelineUsingToggle = openTimelineUsingToggle;

const closeTimelineUsingToggle = () => {
  cy.get(_security_main.TIMELINE_TOGGLE_BUTTON).filter(':visible').click();
};

exports.closeTimelineUsingToggle = closeTimelineUsingToggle;

const closeTimelineUsingCloseButton = () => {
  cy.get(_security_main.CLOSE_TIMELINE_BUTTON).filter(':visible').click();
};

exports.closeTimelineUsingCloseButton = closeTimelineUsingCloseButton;

const openTimelineIfClosed = () => cy.get(_security_main.MAIN_PAGE).then($page => {
  if ($page.find(_security_main.TIMELINE_BOTTOM_BAR_TOGGLE_BUTTON).length === 1) {
    openTimelineUsingToggle();
  }
});

exports.openTimelineIfClosed = openTimelineIfClosed;