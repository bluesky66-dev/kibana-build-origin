"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimelinesToInstall = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTimelinesToInstall = (timelinesFromFileSystem, installedTimelines) => {
  return timelinesFromFileSystem.filter(timeline => !installedTimelines.some(installedTimeline => installedTimeline.templateTimelineId === timeline.templateTimelineId));
};

exports.getTimelinesToInstall = getTimelinesToInstall;