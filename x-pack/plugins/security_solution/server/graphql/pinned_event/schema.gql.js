"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pinnedEventSchema = void 0;

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const pinnedEventSchema = (0, _graphqlTag.default)`
  #########################
  ####  Mutation/Query ####
  #########################

  type PinnedEvent {
    code: Float
    message: String
    pinnedEventId: ID!
    eventId: ID
    timelineId: ID
    timelineVersion: String
    created: Float
    createdBy: String
    updated: Float
    updatedBy: String
    version: String
  }

  extend type Query {
    getAllPinnedEventsByTimelineId(timelineId: ID!): [PinnedEvent!]!
  }

  extend type Mutation {
    "Persists a pinned event in a timeline"
    persistPinnedEventOnTimeline(pinnedEventId: ID, eventId: ID!, timelineId: ID): PinnedEvent
    "Remove a pinned events in a timeline"
    deletePinnedEventOnTimeline(id: [ID!]!): Boolean!
    "Remove all pinned events in a timeline"
    deleteAllPinnedEventsOnTimeline(timelineId: ID!): Boolean!
  }
`;
exports.pinnedEventSchema = pinnedEventSchema;