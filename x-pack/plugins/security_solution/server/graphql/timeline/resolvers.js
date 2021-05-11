"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimelineResolvers = void 0;

var _timeline = require("../../../common/types/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createTimelineResolvers = libs => ({
  Query: {
    async getOneTimeline(root, args, {
      req
    }) {
      return libs.timeline.getTimeline(req, args.id, args.timelineType);
    },

    async getAllTimeline(root, args, {
      req
    }) {
      return libs.timeline.getAllTimeline(req, args.onlyUserFavorite || null, args.pageInfo, args.search || null, args.sort || null, args.status || null, args.timelineType || null);
    }

  },
  Mutation: {
    async deleteTimeline(root, args, {
      req
    }) {
      await libs.timeline.deleteTimeline(req, args.id);
      return true;
    },

    async persistFavorite(root, args, {
      req
    }) {
      return libs.timeline.persistFavorite(req, args.timelineId || null, args.templateTimelineId || null, args.templateTimelineVersion || null, args.timelineType || _timeline.TimelineType.default);
    },

    async persistTimeline(root, args, {
      req
    }) {
      return libs.timeline.persistTimeline(req, args.id || null, args.version || null, args.timeline);
    }

  }
});

exports.createTimelineResolvers = createTimelineResolvers;