"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = exports.pinnedEventSavedObjectMappings = exports.pinnedEventSavedObjectType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const pinnedEventSavedObjectType = 'siem-ui-timeline-pinned-event';
exports.pinnedEventSavedObjectType = pinnedEventSavedObjectType;
const pinnedEventSavedObjectMappings = {
  properties: {
    timelineId: {
      type: 'keyword'
    },
    eventId: {
      type: 'keyword'
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
exports.pinnedEventSavedObjectMappings = pinnedEventSavedObjectMappings;
const type = {
  name: pinnedEventSavedObjectType,
  hidden: false,
  namespaceType: 'single',
  mappings: pinnedEventSavedObjectMappings
};
exports.type = type;