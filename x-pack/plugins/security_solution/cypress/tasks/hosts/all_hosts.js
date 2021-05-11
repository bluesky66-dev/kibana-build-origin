"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForAllHostsToBeLoaded = exports.openFirstHostDetails = exports.dragFirstHostToTimeline = exports.unDragFirstHostToEmptyTimelineDataProviders = exports.dragFirstHostToEmptyTimelineDataProviders = exports.dragAndDropFirstHostToTimeline = void 0;

var _all_hosts = require("../../screens/hosts/all_hosts");

var _timeline = require("../../screens/timeline");

var _common = require("../../tasks/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const dragAndDropFirstHostToTimeline = () => {
  cy.get(_all_hosts.HOSTS_NAMES_DRAGGABLE).first().then(firstHost => (0, _common.drag)(firstHost));
  cy.get(_timeline.TIMELINE_DATA_PROVIDERS).filter(':visible').then(dataProvidersDropArea => (0, _common.drop)(dataProvidersDropArea));
};

exports.dragAndDropFirstHostToTimeline = dragAndDropFirstHostToTimeline;

const dragFirstHostToEmptyTimelineDataProviders = () => {
  cy.get(_all_hosts.HOSTS_NAMES_DRAGGABLE).first().then(host => (0, _common.drag)(host));
  cy.get(_timeline.TIMELINE_DATA_PROVIDERS_EMPTY).filter(':visible').then(dataProvidersDropArea => (0, _common.dragWithoutDrop)(dataProvidersDropArea));
};

exports.dragFirstHostToEmptyTimelineDataProviders = dragFirstHostToEmptyTimelineDataProviders;

const unDragFirstHostToEmptyTimelineDataProviders = () => {
  cy.get(_all_hosts.HOSTS_NAMES_DRAGGABLE).first().then(host => {
    cy.wrap(host).trigger('mousemove', {
      button: 0,
      clientX: host[0].getBoundingClientRect().left,
      clientY: host[0].getBoundingClientRect().top,
      force: true
    }).wait(300).trigger('mouseup', {
      force: true
    }).wait(300);
  });
};

exports.unDragFirstHostToEmptyTimelineDataProviders = unDragFirstHostToEmptyTimelineDataProviders;

const dragFirstHostToTimeline = () => {
  cy.get(_all_hosts.HOSTS_NAMES_DRAGGABLE).first().then(host => (0, _common.drag)(host));
};

exports.dragFirstHostToTimeline = dragFirstHostToTimeline;

const openFirstHostDetails = () => {
  cy.get(_all_hosts.HOSTS_NAMES).first().click({
    force: true
  });
};

exports.openFirstHostDetails = openFirstHostDetails;

const waitForAllHostsToBeLoaded = () => {
  cy.get(_all_hosts.ALL_HOSTS_TABLE).should('be.visible');
};

exports.waitForAllHostsToBeLoaded = waitForAllHostsToBeLoaded;