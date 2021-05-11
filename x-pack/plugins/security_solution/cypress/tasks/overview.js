"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandNetworkStats = exports.expandHostStats = exports.expand = void 0;

var _overview = require("../screens/overview");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const expand = statType => {
  cy.get(statType).find('button').invoke('click');
};

exports.expand = expand;

const expandHostStats = () => {
  expand(_overview.OVERVIEW_HOST_STATS);
};

exports.expandHostStats = expandHostStats;

const expandNetworkStats = () => {
  expand(_overview.OVERVIEW_NETWORK_STATS);
};

exports.expandNetworkStats = expandNetworkStats;