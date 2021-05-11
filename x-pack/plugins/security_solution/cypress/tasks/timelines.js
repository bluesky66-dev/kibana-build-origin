"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForTimelinesPanelToBeLoaded = exports.openTimeline = exports.exportTimeline = void 0;

var _timelines = require("../screens/timelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const exportTimeline = timelineId => {
  cy.get((0, _timelines.TIMELINE_CHECKBOX)(timelineId)).click({
    force: true
  });
  cy.get(_timelines.BULK_ACTIONS).click({
    force: true
  });
  cy.get(_timelines.EXPORT_TIMELINE_ACTION).click();
};

exports.exportTimeline = exportTimeline;

const openTimeline = id => {
  const click = $el => cy.wrap($el).click();

  cy.get((0, _timelines.TIMELINE)(id)).should('be.visible').pipe(click);
};

exports.openTimeline = openTimeline;

const waitForTimelinesPanelToBeLoaded = () => {
  cy.get(_timelines.TIMELINES_TABLE).should('exist');
};

exports.waitForTimelinesPanelToBeLoaded = waitForTimelinesPanelToBeLoaded;