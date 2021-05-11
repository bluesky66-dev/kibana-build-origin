"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportTimelineByObjectIds = void 0;

var _fp = require("lodash/fp");

var _create_stream_from_ndjson = require("../../../../utils/read_stream/create_stream_from_ndjson");

var noteLib = _interopRequireWildcard(require("../../../note/saved_object"));

var pinnedEventLib = _interopRequireWildcard(require("../../../pinned_event/saved_object"));

var _saved_object3 = require("../../saved_object");

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
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getGlobalEventNotesByTimelineId = currentNotes => {
  var _currentNotes$reduce;

  const initialNotes = {
    eventNotes: [],
    globalNotes: []
  };
  return (_currentNotes$reduce = currentNotes.reduce((acc, note) => {
    if (note.eventId == null) {
      return { ...acc,
        globalNotes: [...acc.globalNotes, note]
      };
    } else {
      return { ...acc,
        eventNotes: [...acc.eventNotes, note]
      };
    }
  }, initialNotes)) !== null && _currentNotes$reduce !== void 0 ? _currentNotes$reduce : initialNotes;
};

const getPinnedEventsIdsByTimelineId = currentPinnedEvents => {
  var _currentPinnedEvents$;

  return (_currentPinnedEvents$ = currentPinnedEvents.map(event => event.eventId)) !== null && _currentPinnedEvents$ !== void 0 ? _currentPinnedEvents$ : [];
};

const getTimelinesFromObjects = async (request, ids) => {
  var _ref;

  const {
    timelines,
    errors
  } = await (0, _saved_object3.getSelectedTimelines)(request, ids);
  const exportedIds = timelines.map(t => t.savedObjectId);
  const [notes, pinnedEvents] = await Promise.all([Promise.all(exportedIds.map(timelineId => noteLib.getNotesByTimelineId(request, timelineId))), Promise.all(exportedIds.map(timelineId => pinnedEventLib.getAllPinnedEventsByTimelineId(request, timelineId)))]);
  const myNotes = notes.reduce((acc, note) => [...acc, ...note], []);
  const myPinnedEventIds = pinnedEvents.reduce((acc, pinnedEventId) => [...acc, ...pinnedEventId], []);
  const myResponse = exportedIds.reduce((acc, timelineId) => {
    const myTimeline = timelines.find(t => t.savedObjectId === timelineId);

    if (myTimeline != null) {
      const timelineNotes = myNotes.filter(n => n.timelineId === timelineId);
      const timelinePinnedEventIds = myPinnedEventIds.filter(p => p.timelineId === timelineId);
      const exportedTimeline = (0, _fp.omit)(['status', 'excludedRowRendererIds'], myTimeline);
      return [...acc, { ...exportedTimeline,
        ...getGlobalEventNotesByTimelineId(timelineNotes),
        pinnedEventIds: getPinnedEventsIdsByTimelineId(timelinePinnedEventIds)
      }];
    }

    return acc;
  }, []);
  return (_ref = [...myResponse, ...errors]) !== null && _ref !== void 0 ? _ref : [];
};

const getExportTimelineByObjectIds = async ({
  frameworkRequest,
  ids
}) => {
  const timeline = await getTimelinesFromObjects(frameworkRequest, ids);
  return (0, _create_stream_from_ndjson.transformDataToNdjson)(timeline);
};

exports.getExportTimelineByObjectIds = getExportTimelineByObjectIds;