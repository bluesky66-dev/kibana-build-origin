"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplateTimeline = exports.getTimeline = exports.createTimelines = exports.saveNotes = exports.savePinnedEvents = exports.saveTimelines = void 0;

var _fp = require("lodash/fp");

var _moment = _interopRequireDefault(require("moment"));

var timelineLib = _interopRequireWildcard(require("../../saved_object"));

var pinnedEventLib = _interopRequireWildcard(require("../../../pinned_event/saved_object"));

var noteLib = _interopRequireWildcard(require("../../../note/saved_object"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

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


const saveTimelines = (frameworkRequest, timeline, timelineSavedObjectId, timelineVersion, isImmutable) => {
  return timelineLib.persistTimeline(frameworkRequest, timelineSavedObjectId !== null && timelineSavedObjectId !== void 0 ? timelineSavedObjectId : null, timelineVersion !== null && timelineVersion !== void 0 ? timelineVersion : null, timeline, isImmutable);
};

exports.saveTimelines = saveTimelines;

const savePinnedEvents = (frameworkRequest, timelineSavedObjectId, pinnedEventIds) => Promise.all(pinnedEventIds.map(eventId => pinnedEventLib.persistPinnedEventOnTimeline(frameworkRequest, null, // pinnedEventSavedObjectId
eventId, timelineSavedObjectId)));

exports.savePinnedEvents = savePinnedEvents;

const getNewNote = async (frameworkRequest, note, timelineSavedObjectId, overrideOwner) => {
  let savedNote = note;

  try {
    savedNote = await noteLib.getNote(frameworkRequest, note.noteId); // eslint-disable-next-line no-empty
  } catch (e) {}

  return overrideOwner ? {
    eventId: note.eventId,
    note: note.note,
    timelineId: timelineSavedObjectId
  } : {
    eventId: savedNote.eventId,
    note: savedNote.note,
    created: savedNote.created,
    createdBy: savedNote.createdBy,
    updated: savedNote.updated,
    updatedBy: savedNote.updatedBy,
    timelineId: timelineSavedObjectId
  };
};

const saveNotes = async (frameworkRequest, timelineSavedObjectId, timelineVersion, existingNoteIds, newNotes, overrideOwner = true) => {
  var _newNotes$map;

  return Promise.all((_newNotes$map = newNotes === null || newNotes === void 0 ? void 0 : newNotes.map(async note => {
    var _existingNoteIds$find;

    const newNote = await getNewNote(frameworkRequest, note, timelineSavedObjectId, overrideOwner);
    return noteLib.persistNote(frameworkRequest, overrideOwner ? (_existingNoteIds$find = existingNoteIds === null || existingNoteIds === void 0 ? void 0 : existingNoteIds.find(nId => nId === note.noteId)) !== null && _existingNoteIds$find !== void 0 ? _existingNoteIds$find : null : null, timelineVersion !== null && timelineVersion !== void 0 ? timelineVersion : null, newNote, overrideOwner);
  })) !== null && _newNotes$map !== void 0 ? _newNotes$map : []);
};

exports.saveNotes = saveNotes;
/** allow overrideNotesOwner means overriding by current username,
 * disallow overrideNotesOwner means keep the original username.
 * overrideNotesOwner = false only happens when import timeline templates,
 * as we want to keep the original creator for notes
 **/

const createTimelines = async ({
  frameworkRequest,
  timeline,
  timelineSavedObjectId = null,
  timelineVersion = null,
  pinnedEventIds = null,
  notes = [],
  existingNoteIds = [],
  isImmutable,
  overrideNotesOwner = true
}) => {
  var _timeline$dateRange, _timeline$dateRange2;

  const timerangeStart = isImmutable ? (0, _moment.default)().subtract(24, 'hours').toISOString() : (_timeline$dateRange = timeline.dateRange) === null || _timeline$dateRange === void 0 ? void 0 : _timeline$dateRange.start;
  const timerangeEnd = isImmutable ? (0, _moment.default)().toISOString() : (_timeline$dateRange2 = timeline.dateRange) === null || _timeline$dateRange2 === void 0 ? void 0 : _timeline$dateRange2.end;
  const responseTimeline = await saveTimelines(frameworkRequest, { ...timeline,
    dateRange: {
      start: timerangeStart,
      end: timerangeEnd
    }
  }, timelineSavedObjectId, timelineVersion, isImmutable);
  const newTimelineSavedObjectId = responseTimeline.timeline.savedObjectId;
  const newTimelineVersion = responseTimeline.timeline.version;
  let myPromises = [];

  if (pinnedEventIds != null && !(0, _fp.isEmpty)(pinnedEventIds)) {
    myPromises = [...myPromises, savePinnedEvents(frameworkRequest, timelineSavedObjectId !== null && timelineSavedObjectId !== void 0 ? timelineSavedObjectId : newTimelineSavedObjectId, pinnedEventIds)];
  }

  if (!(0, _fp.isEmpty)(notes)) {
    myPromises = [...myPromises, saveNotes(frameworkRequest, timelineSavedObjectId !== null && timelineSavedObjectId !== void 0 ? timelineSavedObjectId : newTimelineSavedObjectId, newTimelineVersion, existingNoteIds, notes, overrideNotesOwner)];
  }

  if (myPromises.length > 0) {
    await Promise.all(myPromises);
  }

  return responseTimeline;
};

exports.createTimelines = createTimelines;

const getTimeline = async (frameworkRequest, savedObjectId) => {
  let timeline = null;

  try {
    timeline = await timelineLib.getTimeline(frameworkRequest, savedObjectId); // eslint-disable-next-line no-empty
  } catch (e) {}

  return timeline;
};

exports.getTimeline = getTimeline;

const getTemplateTimeline = async (frameworkRequest, templateTimelineId) => {
  var _templateTimeline$tim, _templateTimeline;

  let templateTimeline = null;

  try {
    templateTimeline = await timelineLib.getTimelineByTemplateTimelineId(frameworkRequest, templateTimelineId);
  } catch (e) {
    return null;
  }

  return (_templateTimeline$tim = (_templateTimeline = templateTimeline) === null || _templateTimeline === void 0 ? void 0 : _templateTimeline.timeline[0]) !== null && _templateTimeline$tim !== void 0 ? _templateTimeline$tim : null;
};

exports.getTemplateTimeline = getTemplateTimeline;