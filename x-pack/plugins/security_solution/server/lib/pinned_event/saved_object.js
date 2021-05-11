"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickSavedPinnedEvent = exports.convertSavedObjectToSavedPinnedEvent = exports.persistPinnedEventOnTimeline = exports.getAllPinnedEvents = exports.getAllPinnedEventsByTimelineId = exports.getPinnedEvent = exports.deleteAllPinnedEventsOnTimeline = exports.deletePinnedEventOnTimeline = void 0;

var _PathReporter = require("io-ts/lib/PathReporter");

var _fp = require("lodash/fp");

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _constants = require("../../../common/constants");

var _pinned_event = require("../../../common/types/timeline/pinned_event");

var _pick_saved_timeline = require("../timeline/pick_saved_timeline");

var _convert_saved_object_to_savedtimeline = require("../timeline/convert_saved_object_to_savedtimeline");

var _saved_object_mappings = require("./saved_object_mappings");

var _saved_object_mappings2 = require("../timeline/saved_object_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deletePinnedEventOnTimeline = async (request, pinnedEventIds) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  await Promise.all(pinnedEventIds.map(pinnedEventId => savedObjectsClient.delete(_saved_object_mappings.pinnedEventSavedObjectType, pinnedEventId)));
};

exports.deletePinnedEventOnTimeline = deletePinnedEventOnTimeline;

const deleteAllPinnedEventsOnTimeline = async (request, timelineId) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  const options = {
    type: _saved_object_mappings.pinnedEventSavedObjectType,
    search: timelineId,
    searchFields: ['timelineId']
  };
  const pinnedEventToBeDeleted = await getAllSavedPinnedEvents(request, options);
  await Promise.all(pinnedEventToBeDeleted.map(pinnedEvent => savedObjectsClient.delete(_saved_object_mappings.pinnedEventSavedObjectType, pinnedEvent.pinnedEventId)));
};

exports.deleteAllPinnedEventsOnTimeline = deleteAllPinnedEventsOnTimeline;

const getPinnedEvent = async (request, pinnedEventId) => {
  return getSavedPinnedEvent(request, pinnedEventId);
};

exports.getPinnedEvent = getPinnedEvent;

const getAllPinnedEventsByTimelineId = async (request, timelineId) => {
  const options = {
    type: _saved_object_mappings.pinnedEventSavedObjectType,
    search: timelineId,
    searchFields: ['timelineId']
  };
  return getAllSavedPinnedEvents(request, options);
};

exports.getAllPinnedEventsByTimelineId = getAllPinnedEventsByTimelineId;

const getAllPinnedEvents = async (request, pageInfo, search, sort) => {
  const options = {
    type: _saved_object_mappings.pinnedEventSavedObjectType,
    perPage: pageInfo != null ? pageInfo.pageSize : undefined,
    page: pageInfo != null ? pageInfo.pageIndex : undefined,
    search: search != null ? search : undefined,
    searchFields: ['timelineId', 'eventId'],
    sortField: sort != null ? sort.sortField : undefined,
    sortOrder: sort != null ? sort.sortOrder : undefined
  };
  return getAllSavedPinnedEvents(request, options);
};

exports.getAllPinnedEvents = getAllPinnedEvents;

const persistPinnedEventOnTimeline = async (request, pinnedEventId, eventId, timelineId) => {
  const savedObjectsClient = request.context.core.savedObjects.client;

  try {
    if (pinnedEventId == null) {
      const timelineVersionSavedObject = timelineId == null ? await (async () => {
        const timelineResult = (0, _convert_saved_object_to_savedtimeline.convertSavedObjectToSavedTimeline)(await savedObjectsClient.create(_saved_object_mappings2.timelineSavedObjectType, (0, _pick_saved_timeline.pickSavedTimeline)(null, {}, request.user || null)));
        timelineId = timelineResult.savedObjectId; // eslint-disable-line no-param-reassign

        return timelineResult.version;
      })() : null;

      if (timelineId != null) {
        const allPinnedEventId = await getAllPinnedEventsByTimelineId(request, timelineId);
        const isPinnedAlreadyExisting = allPinnedEventId.filter(pinnedEvent => pinnedEvent.eventId === eventId);

        if (isPinnedAlreadyExisting.length === 0) {
          const savedPinnedEvent = {
            eventId,
            timelineId
          }; // create Pinned Event on Timeline

          return convertSavedObjectToSavedPinnedEvent(await savedObjectsClient.create(_saved_object_mappings.pinnedEventSavedObjectType, pickSavedPinnedEvent(pinnedEventId, savedPinnedEvent, request.user || null)), timelineVersionSavedObject != null ? timelineVersionSavedObject : undefined);
        }

        return isPinnedAlreadyExisting[0];
      }

      throw new Error('You can NOT pinned event without a timelineID');
    } // Delete Pinned Event on Timeline


    await deletePinnedEventOnTimeline(request, [pinnedEventId]);
    return null;
  } catch (err) {
    if ((0, _fp.getOr)(null, 'output.statusCode', err) === 404) {
      /*
       * Why we are doing that, because if it is not found for sure that it will be unpinned
       * There is no need to bring back this error since we can assume that it is unpinned
       */
      return null;
    }

    if ((0, _fp.getOr)(null, 'output.statusCode', err) === 403) {
      return pinnedEventId != null ? {
        code: 403,
        message: err.message,
        pinnedEventId: eventId,
        timelineId: '',
        timelineVersion: ''
      } : null;
    }

    throw err;
  }
};

exports.persistPinnedEventOnTimeline = persistPinnedEventOnTimeline;

const getSavedPinnedEvent = async (request, pinnedEventId) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  const savedObject = await savedObjectsClient.get(_saved_object_mappings.pinnedEventSavedObjectType, pinnedEventId);
  return convertSavedObjectToSavedPinnedEvent(savedObject);
};

const getAllSavedPinnedEvents = async (request, options) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  const savedObjects = await savedObjectsClient.find(options);
  return savedObjects.saved_objects.map(savedObject => convertSavedObjectToSavedPinnedEvent(savedObject));
};

const convertSavedObjectToSavedPinnedEvent = (savedObject, timelineVersion) => (0, _pipeable.pipe)(_pinned_event.PinnedEventSavedObjectRuntimeType.decode(savedObject), (0, _Either.map)(savedPinnedEvent => ({
  pinnedEventId: savedPinnedEvent.id,
  version: savedPinnedEvent.version,
  timelineVersion,
  ...savedPinnedEvent.attributes
})), (0, _Either.fold)(errors => {
  throw new Error((0, _PathReporter.failure)(errors).join('\n'));
}, _function.identity)); // we have to use any here because the SavedObjectAttributes interface is like below
// export interface SavedObjectAttributes {
//   [key: string]: SavedObjectAttributes | string | number | boolean | null;
// }
// then this interface does not allow types without index signature
// this is limiting us with our type for now so the easy way was to use any


exports.convertSavedObjectToSavedPinnedEvent = convertSavedObjectToSavedPinnedEvent;

const pickSavedPinnedEvent = (pinnedEventId, savedPinnedEvent, userInfo) => {
  const dateNow = new Date().valueOf();

  if (pinnedEventId == null) {
    var _userInfo$username, _userInfo$username2;

    savedPinnedEvent.created = dateNow;
    savedPinnedEvent.createdBy = (_userInfo$username = userInfo === null || userInfo === void 0 ? void 0 : userInfo.username) !== null && _userInfo$username !== void 0 ? _userInfo$username : _constants.UNAUTHENTICATED_USER;
    savedPinnedEvent.updated = dateNow;
    savedPinnedEvent.updatedBy = (_userInfo$username2 = userInfo === null || userInfo === void 0 ? void 0 : userInfo.username) !== null && _userInfo$username2 !== void 0 ? _userInfo$username2 : _constants.UNAUTHENTICATED_USER;
  } else if (pinnedEventId != null) {
    var _userInfo$username3;

    savedPinnedEvent.updated = dateNow;
    savedPinnedEvent.updatedBy = (_userInfo$username3 = userInfo === null || userInfo === void 0 ? void 0 : userInfo.username) !== null && _userInfo$username3 !== void 0 ? _userInfo$username3 : _constants.UNAUTHENTICATED_USER;
  }

  return savedPinnedEvent;
};

exports.pickSavedPinnedEvent = pickSavedPinnedEvent;