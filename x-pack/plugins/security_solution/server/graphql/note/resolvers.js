"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNoteResolvers = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createNoteResolvers = libs => ({
  Query: {
    async getNote(root, args, {
      req
    }) {
      return libs.note.getNote(req, args.id);
    },

    async getAllNotes(root, args, {
      req
    }) {
      return libs.note.getAllNotes(req, args.pageInfo || null, args.search || null, args.sort || null);
    },

    async getNotesByEventId(root, args, {
      req
    }) {
      return libs.note.getNotesByEventId(req, args.eventId);
    },

    async getNotesByTimelineId(root, args, {
      req
    }) {
      return libs.note.getNotesByTimelineId(req, args.timelineId);
    }

  },
  Mutation: {
    async deleteNote(root, args, {
      req
    }) {
      await libs.note.deleteNote(req, args.id);
      return true;
    },

    async deleteNoteByTimelineId(root, args, {
      req
    }) {
      await libs.note.deleteNoteByTimelineId(req, args.timelineId);
      return true;
    },

    async persistNote(root, args, {
      req
    }) {
      return libs.note.persistNote(req, args.noteId || null, args.version || null, { ...args.note,
        timelineId: args.note.timelineId || null
      }, true);
    }

  }
});

exports.createNoteResolvers = createNoteResolvers;