"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noteSchema = void 0;

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


const note = `
  eventId: String
  note: String
  timelineId: String
`;
const noteSchema = (0, _graphqlTag.default)`
  ###############
  #### INPUT ####
  ###############

  input NoteInput {
    ${note}
  }

  input PageInfoNote {
    pageIndex: Float!
    pageSize: Float!
  }

  enum SortFieldNote {
    updatedBy
    updated
  }
  
  input SortNote {
    sortField: SortFieldNote!
    sortOrder: Direction!
  }

  ###############
  #### QUERY ####
  ###############
  type NoteResult {
    ${note}
    noteId: String!
    created: Float
    createdBy: String
    timelineVersion: String
    updated: Float
    updatedBy: String
    version: String
  }

  type ResponseNote {
    code: Float
    message: String
    note: NoteResult!
  }

  type ResponseNotes {
    notes: [NoteResult!]!
    totalCount: Float
  }

  #########################
  ####  Mutation/Query ####
  #########################

  extend type Query {
    getNote(id: ID!): NoteResult!
    getNotesByTimelineId(timelineId: ID!): [NoteResult!]!
    getNotesByEventId(eventId: ID!): [NoteResult!]!
    getAllNotes(pageInfo: PageInfoNote, search: String, sort: SortNote): ResponseNotes!
  }

  extend type Mutation {
    "Persists a note"
    persistNote(noteId: ID, version: String, note: NoteInput!): ResponseNote!
    deleteNote(id: [ID!]!):Boolean
    deleteNoteByTimelineId(timelineId: ID!, version: String):Boolean
  }
`;
exports.noteSchema = noteSchema;