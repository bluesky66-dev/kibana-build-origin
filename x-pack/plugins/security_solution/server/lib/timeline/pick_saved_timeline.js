"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickSavedTimeline = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../common/constants");

var _timeline = require("../../../common/types/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const pickSavedTimeline = (timelineId, savedTimeline, userInfo) => {
  var _savedTimeline$exclud;

  const dateNow = new Date().valueOf();

  if (timelineId == null) {
    var _userInfo$username, _userInfo$username2;

    savedTimeline.created = dateNow;
    savedTimeline.createdBy = (_userInfo$username = userInfo === null || userInfo === void 0 ? void 0 : userInfo.username) !== null && _userInfo$username !== void 0 ? _userInfo$username : _constants.UNAUTHENTICATED_USER;
    savedTimeline.updated = dateNow;
    savedTimeline.updatedBy = (_userInfo$username2 = userInfo === null || userInfo === void 0 ? void 0 : userInfo.username) !== null && _userInfo$username2 !== void 0 ? _userInfo$username2 : _constants.UNAUTHENTICATED_USER;
  } else if (timelineId != null) {
    var _userInfo$username3;

    savedTimeline.updated = dateNow;
    savedTimeline.updatedBy = (_userInfo$username3 = userInfo === null || userInfo === void 0 ? void 0 : userInfo.username) !== null && _userInfo$username3 !== void 0 ? _userInfo$username3 : _constants.UNAUTHENTICATED_USER;
  }

  if (savedTimeline.status === _timeline.TimelineStatus.draft || savedTimeline.status == null) {
    savedTimeline.status = !(0, _fp.isEmpty)(savedTimeline.title) ? _timeline.TimelineStatus.active : _timeline.TimelineStatus.draft;
  }

  if (savedTimeline.timelineType === _timeline.TimelineType.default) {
    var _savedTimeline$timeli, _savedTimeline$status;

    savedTimeline.timelineType = (_savedTimeline$timeli = savedTimeline.timelineType) !== null && _savedTimeline$timeli !== void 0 ? _savedTimeline$timeli : _timeline.TimelineType.default;
    savedTimeline.status = (_savedTimeline$status = savedTimeline.status) !== null && _savedTimeline$status !== void 0 ? _savedTimeline$status : _timeline.TimelineStatus.active;
    savedTimeline.templateTimelineId = null;
    savedTimeline.templateTimelineVersion = null;
  }

  if (!(0, _fp.isEmpty)(savedTimeline.title) && savedTimeline.status === _timeline.TimelineStatus.draft) {
    savedTimeline.status = _timeline.TimelineStatus.active;
  }

  savedTimeline.excludedRowRendererIds = (_savedTimeline$exclud = savedTimeline.excludedRowRendererIds) !== null && _savedTimeline$exclud !== void 0 ? _savedTimeline$exclud : [];
  return savedTimeline;
};

exports.pickSavedTimeline = pickSavedTimeline;