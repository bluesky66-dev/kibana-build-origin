"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openKibanaNavigation = exports.navigateFromKibanaCollapsibleTo = void 0;

var _kibana_navigation = require("../screens/kibana_navigation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const navigateFromKibanaCollapsibleTo = page => {
  cy.get(page).click();
};

exports.navigateFromKibanaCollapsibleTo = navigateFromKibanaCollapsibleTo;

const openKibanaNavigation = () => {
  cy.get(_kibana_navigation.KIBANA_NAVIGATION_TOGGLE).click();
};

exports.openKibanaNavigation = openKibanaNavigation;