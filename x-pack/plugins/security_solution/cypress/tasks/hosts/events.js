"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dragAndDropColumn = exports.waitsForEventsToBeLoaded = exports.opensInspectQueryModal = exports.openEventsViewerFieldsBrowser = exports.loadMoreEvents = exports.closeModal = exports.addsHostGeoCountryNameToHeader = exports.addsHostGeoCityNameToHeader = void 0;

var _common = require("../common");

var _events = require("../../screens/hosts/events");

var _timeline = require("../../screens/timeline");

var _security_header = require("../../screens/security_header");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const addsHostGeoCityNameToHeader = () => {
  cy.get(_events.HOST_GEO_CITY_NAME_CHECKBOX).check({
    force: true
  });
};

exports.addsHostGeoCityNameToHeader = addsHostGeoCityNameToHeader;

const addsHostGeoCountryNameToHeader = () => {
  cy.get(_events.HOST_GEO_COUNTRY_NAME_CHECKBOX).check({
    force: true
  });
};

exports.addsHostGeoCountryNameToHeader = addsHostGeoCountryNameToHeader;

const closeModal = () => {
  cy.get(_events.CLOSE_MODAL).click();
};

exports.closeModal = closeModal;

const loadMoreEvents = () => {
  cy.get(_events.LOAD_MORE).click({
    force: true
  });
};

exports.loadMoreEvents = loadMoreEvents;

const openEventsViewerFieldsBrowser = () => {
  cy.get(_events.EVENTS_VIEWER_FIELDS_BUTTON).click({
    force: true
  });
  cy.get(_events.SERVER_SIDE_EVENT_COUNT).should('not.have.text', '0');
  cy.get(_events.FIELDS_BROWSER_CONTAINER).should('exist');
};

exports.openEventsViewerFieldsBrowser = openEventsViewerFieldsBrowser;

const opensInspectQueryModal = () => {
  cy.get(_events.INSPECT_QUERY).should('exist').trigger('mousemove', {
    force: true
  }).click({
    force: true
  });
};

exports.opensInspectQueryModal = opensInspectQueryModal;

const waitsForEventsToBeLoaded = () => {
  cy.get(_events.SERVER_SIDE_EVENT_COUNT).should('not.have.text', '0');
  cy.get(_security_header.REFRESH_BUTTON).should('not.have.text', 'Updating');
  cy.get(_events.EVENTS_VIEWER_PAGINATION).should('exist');
};

exports.waitsForEventsToBeLoaded = waitsForEventsToBeLoaded;

const dragAndDropColumn = ({
  column,
  newPosition
}) => {
  cy.get(_timeline.DRAGGABLE_HEADER).first().should('exist');
  cy.get(_timeline.DRAGGABLE_HEADER).eq(column).then(header => (0, _common.drag)(header));
  cy.get(_timeline.DRAGGABLE_HEADER).eq(newPosition).then(targetPosition => {
    (0, _common.drop)(targetPosition);
  });
};

exports.dragAndDropColumn = dragAndDropColumn;