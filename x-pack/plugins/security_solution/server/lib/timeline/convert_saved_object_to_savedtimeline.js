"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertSavedObjectToSavedTimeline = exports.TimelineSavedObjectWithDraftRuntimeType = void 0;

var _index = require("io-ts/lib/index");

var _PathReporter = require("io-ts/lib/PathReporter");

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _timeline = require("../../../common/types/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: Added to support legacy TimelineType.draft, can be removed in 7.10


const TimelineSavedObjectWithDraftRuntimeType = (0, _index.intersection)([(0, _index.type)({
  id: _index.string,
  version: _index.string,
  attributes: (0, _index.partial)({ ..._timeline.SavedTimelineRuntimeType.props,
    timelineType: (0, _index.union)([_timeline.TimelineTypeLiteralWithNullRt, (0, _index.literal)('draft')])
  })
}), (0, _index.partial)({
  savedObjectId: _index.string
})]);
exports.TimelineSavedObjectWithDraftRuntimeType = TimelineSavedObjectWithDraftRuntimeType;

const getTimelineTypeAndStatus = (timelineType = _timeline.TimelineType.default, status = _timeline.TimelineStatus.active) => {
  // TODO: Added to support legacy TimelineType.draft, can be removed in 7.10
  if (timelineType === 'draft') {
    return {
      timelineType: _timeline.TimelineType.default,
      status: _timeline.TimelineStatus.draft
    };
  }

  return {
    timelineType,
    status
  };
};

const convertSavedObjectToSavedTimeline = savedObject => {
  const timeline = (0, _pipeable.pipe)(TimelineSavedObjectWithDraftRuntimeType.decode(savedObject), (0, _Either.map)(savedTimeline => {
    const attributes = { ...savedTimeline.attributes,
      ...getTimelineTypeAndStatus(savedTimeline.attributes.timelineType, savedTimeline.attributes.status),
      sort: savedTimeline.attributes.sort != null ? Array.isArray(savedTimeline.attributes.sort) ? savedTimeline.attributes.sort : [savedTimeline.attributes.sort] : []
    };
    return {
      savedObjectId: savedTimeline.id,
      version: savedTimeline.version,
      ...attributes
    };
  }), (0, _Either.fold)(errors => {
    throw new Error((0, _PathReporter.failure)(errors).join('\n'));
  }, _function.identity));
  return timeline;
};

exports.convertSavedObjectToSavedTimeline = convertSavedObjectToSavedTimeline;