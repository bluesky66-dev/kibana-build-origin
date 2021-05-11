"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetFields = exports.removesMessageField = exports.filterFieldsBrowser = exports.closeFieldsBrowser = exports.clearFieldsBrowser = exports.addsHostGeoCountryNameToTimelineDraggingIt = exports.addsHostGeoContinentNameToTimeline = exports.addsHostGeoCityNameToTimeline = void 0;

var _common = require("../tasks/common");

var _fields_browser = require("../screens/fields_browser");

var _main = require("../screens/hosts/main");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const addsHostGeoCityNameToTimeline = () => {
  cy.get(_fields_browser.FIELDS_BROWSER_HOST_GEO_CITY_NAME_CHECKBOX).check({
    force: true
  });
};

exports.addsHostGeoCityNameToTimeline = addsHostGeoCityNameToTimeline;

const addsHostGeoContinentNameToTimeline = () => {
  cy.get(_fields_browser.FIELDS_BROWSER_HOST_GEO_CONTINENT_NAME_CHECKBOX).check({
    force: true
  });
};

exports.addsHostGeoContinentNameToTimeline = addsHostGeoContinentNameToTimeline;

const addsHostGeoCountryNameToTimelineDraggingIt = () => {
  cy.get(_fields_browser.FIELDS_BROWSER_DRAGGABLE_HOST_GEO_COUNTRY_NAME_HEADER).should('exist');
  cy.get(_fields_browser.FIELDS_BROWSER_DRAGGABLE_HOST_GEO_COUNTRY_NAME_HEADER).then(field => (0, _common.drag)(field));
  cy.get(_fields_browser.FIELDS_BROWSER_HEADER_DROP_AREA).first().then(headersDropArea => (0, _common.drop)(headersDropArea));
};

exports.addsHostGeoCountryNameToTimelineDraggingIt = addsHostGeoCountryNameToTimelineDraggingIt;

const clearFieldsBrowser = () => {
  cy.get(_fields_browser.FIELDS_BROWSER_FILTER_INPUT).type('{selectall}{backspace}');
};

exports.clearFieldsBrowser = clearFieldsBrowser;

const closeFieldsBrowser = () => {
  cy.get(_main.KQL_SEARCH_BAR).click({
    force: true
  });
};

exports.closeFieldsBrowser = closeFieldsBrowser;

const filterFieldsBrowser = fieldName => {
  cy.get(_fields_browser.FIELDS_BROWSER_FILTER_INPUT).type(fieldName).should('not.have.class', 'euiFieldSearch-isLoading');
};

exports.filterFieldsBrowser = filterFieldsBrowser;

const removesMessageField = () => {
  cy.get(_fields_browser.FIELDS_BROWSER_MESSAGE_CHECKBOX).uncheck({
    force: true
  });
};

exports.removesMessageField = removesMessageField;

const resetFields = () => {
  cy.get(_fields_browser.FIELDS_BROWSER_RESET_FIELDS).click({
    force: true
  });
};

exports.resetFields = resetFields;