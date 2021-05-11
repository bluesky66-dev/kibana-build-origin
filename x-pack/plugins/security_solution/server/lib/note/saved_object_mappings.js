"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = exports.noteSavedObjectMappings = exports.noteSavedObjectType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const noteSavedObjectType = 'siem-ui-timeline-note';
exports.noteSavedObjectType = noteSavedObjectType;
const noteSavedObjectMappings = {
  properties: {
    timelineId: {
      type: 'keyword'
    },
    eventId: {
      type: 'keyword'
    },
    note: {
      type: 'text'
    },
    created: {
      type: 'date'
    },
    createdBy: {
      type: 'text'
    },
    updated: {
      type: 'date'
    },
    updatedBy: {
      type: 'text'
    }
  }
};
exports.noteSavedObjectMappings = noteSavedObjectMappings;
const type = {
  name: noteSavedObjectType,
  hidden: false,
  namespaceType: 'single',
  mappings: noteSavedObjectMappings
};
exports.type = type;