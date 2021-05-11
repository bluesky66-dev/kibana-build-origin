"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openUncommonProcesses = exports.openEvents = exports.openAuthentications = exports.openAllHosts = void 0;

var _main = require("../../screens/hosts/main");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const openAllHosts = () => cy.get(_main.ALL_HOSTS_TAB).click({
  force: true
});

exports.openAllHosts = openAllHosts;

const openAuthentications = () => cy.get(_main.AUTHENTICATIONS_TAB).click({
  force: true
});

exports.openAuthentications = openAuthentications;

const openEvents = () => cy.get(_main.EVENTS_TAB).click({
  force: true
});

exports.openEvents = openEvents;

const openUncommonProcesses = () => cy.get(_main.UNCOMMON_PROCESSES_TAB).click({
  force: true
});

exports.openUncommonProcesses = openUncommonProcesses;