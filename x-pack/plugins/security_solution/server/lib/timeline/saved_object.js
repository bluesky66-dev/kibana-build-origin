"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedTimelines = exports.timelineWithReduxProperties = exports.convertStringToBase64 = exports.deleteTimeline = exports.resetTimeline = exports.persistTimeline = exports.persistFavorite = exports.getDraftTimeline = exports.getAllTimeline = exports.getExistingPrepackagedTimelines = exports.getTimelineByTemplateTimelineId = exports.getTimeline = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../common/constants");

var _types = require("../../graphql/types");

var note = _interopRequireWildcard(require("../note/saved_object"));

var pinnedEvent = _interopRequireWildcard(require("../pinned_event/saved_object"));

var _convert_saved_object_to_savedtimeline = require("./convert_saved_object_to_savedtimeline");

var _pick_saved_timeline = require("./pick_saved_timeline");

var _saved_object_mappings = require("./saved_object_mappings");

var _default_timeline = require("./default_timeline");

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


const getTimeline = async (request, timelineId, timelineType = _types.TimelineType.default) => {
  let timelineIdToUse = timelineId;

  try {
    if (timelineType === _types.TimelineType.template) {
      const options = {
        type: _saved_object_mappings.timelineSavedObjectType,
        perPage: 1,
        page: 1,
        filter: `siem-ui-timeline.attributes.templateTimelineId: ${timelineId}`
      };
      const result = await getAllSavedTimeline(request, options);

      if (result.totalCount === 1) {
        timelineIdToUse = result.timeline[0].savedObjectId;
      }
    }
  } catch {// TO DO, we need to bring the logger here
  }

  return getSavedTimeline(request, timelineIdToUse);
};

exports.getTimeline = getTimeline;

const getTimelineByTemplateTimelineId = async (request, templateTimelineId) => {
  const options = {
    type: _saved_object_mappings.timelineSavedObjectType,
    filter: `siem-ui-timeline.attributes.templateTimelineId: "${templateTimelineId}"`
  };
  return getAllSavedTimeline(request, options);
};
/** The filter here is able to handle the legacy data,
 * which has no timelineType exists in the savedObject */


exports.getTimelineByTemplateTimelineId = getTimelineByTemplateTimelineId;

const getTimelineTypeFilter = (timelineType, status) => {
  const typeFilter = timelineType == null ? null : timelineType === _types.TimelineType.template ? `siem-ui-timeline.attributes.timelineType: ${_types.TimelineType.template}`
  /** Show only whose timelineType exists and equals to "template" */
  :
  /** Show me every timeline whose timelineType is not "template".
   * which includes timelineType === 'default' and
   * those timelineType doesn't exists */
  `not siem-ui-timeline.attributes.timelineType: ${_types.TimelineType.template}`;
  /** Show me every timeline whose status is not "draft".
   * which includes status === 'active' and
   * those status doesn't exists */

  const draftFilter = status === _types.TimelineStatus.draft ? `siem-ui-timeline.attributes.status: ${_types.TimelineStatus.draft}` : `not siem-ui-timeline.attributes.status: ${_types.TimelineStatus.draft}`;
  const immutableFilter = status == null ? null : status === _types.TimelineStatus.immutable ? `siem-ui-timeline.attributes.status: ${_types.TimelineStatus.immutable}` : `not siem-ui-timeline.attributes.status: ${_types.TimelineStatus.immutable}`;
  const filters = [typeFilter, draftFilter, immutableFilter];
  return filters.filter(f => f != null).join(' and ');
};

const getExistingPrepackagedTimelines = async (request, countsOnly, pageInfo) => {
  var _perPage$page;

  const queryPageInfo = countsOnly && pageInfo == null ? {
    perPage: 1,
    page: 1
  } : (_perPage$page = {
    perPage: pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.pageSize,
    page: pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.pageIndex
  }) !== null && _perPage$page !== void 0 ? _perPage$page : {};
  const elasticTemplateTimelineOptions = {
    type: _saved_object_mappings.timelineSavedObjectType,
    ...queryPageInfo,
    filter: getTimelineTypeFilter(_types.TimelineType.template, _types.TimelineStatus.immutable)
  };
  return getAllSavedTimeline(request, elasticTemplateTimelineOptions);
};

exports.getExistingPrepackagedTimelines = getExistingPrepackagedTimelines;

const getAllTimeline = async (request, onlyUserFavorite, pageInfo, search, sort, status, timelineType) => {
  const options = {
    type: _saved_object_mappings.timelineSavedObjectType,
    perPage: pageInfo.pageSize,
    page: pageInfo.pageIndex,
    search: search != null ? search : undefined,
    searchFields: onlyUserFavorite ? ['title', 'description', 'favorite.keySearch'] : ['title', 'description'],
    filter: getTimelineTypeFilter(timelineType !== null && timelineType !== void 0 ? timelineType : null, status !== null && status !== void 0 ? status : null),
    sortField: sort != null ? sort.sortField : undefined,
    sortOrder: sort != null ? sort.sortOrder : undefined
  };
  const timelineOptions = {
    type: _saved_object_mappings.timelineSavedObjectType,
    perPage: 1,
    page: 1,
    filter: getTimelineTypeFilter(_types.TimelineType.default, _types.TimelineStatus.active)
  };
  const templateTimelineOptions = {
    type: _saved_object_mappings.timelineSavedObjectType,
    perPage: 1,
    page: 1,
    filter: getTimelineTypeFilter(_types.TimelineType.template, null)
  };
  const customTemplateTimelineOptions = {
    type: _saved_object_mappings.timelineSavedObjectType,
    perPage: 1,
    page: 1,
    filter: getTimelineTypeFilter(_types.TimelineType.template, _types.TimelineStatus.active)
  };
  const favoriteTimelineOptions = {
    type: _saved_object_mappings.timelineSavedObjectType,
    searchFields: ['title', 'description', 'favorite.keySearch'],
    perPage: 1,
    page: 1,
    filter: getTimelineTypeFilter(timelineType !== null && timelineType !== void 0 ? timelineType : null, _types.TimelineStatus.active)
  };
  const result = await Promise.all([getAllSavedTimeline(request, options), getAllSavedTimeline(request, timelineOptions), getAllSavedTimeline(request, templateTimelineOptions), getExistingPrepackagedTimelines(request, true), getAllSavedTimeline(request, customTemplateTimelineOptions), getAllSavedTimeline(request, favoriteTimelineOptions)]);
  return Promise.resolve({ ...result[0],
    defaultTimelineCount: result[1].totalCount,
    templateTimelineCount: result[2].totalCount,
    elasticTemplateTimelineCount: result[3].totalCount,
    customTemplateTimelineCount: result[4].totalCount,
    favoriteCount: result[5].totalCount
  });
};

exports.getAllTimeline = getAllTimeline;

const getDraftTimeline = async (request, timelineType) => {
  const options = {
    type: _saved_object_mappings.timelineSavedObjectType,
    perPage: 1,
    filter: getTimelineTypeFilter(timelineType, _types.TimelineStatus.draft),
    sortField: 'created',
    sortOrder: 'desc'
  };
  return getAllSavedTimeline(request, options);
};

exports.getDraftTimeline = getDraftTimeline;

const persistFavorite = async (request, timelineId, templateTimelineId, templateTimelineVersion, timelineType) => {
  var _request$user$usernam, _request$user, _request$user$full_na, _request$user2;

  const userName = (_request$user$usernam = (_request$user = request.user) === null || _request$user === void 0 ? void 0 : _request$user.username) !== null && _request$user$usernam !== void 0 ? _request$user$usernam : _constants.UNAUTHENTICATED_USER;
  const fullName = (_request$user$full_na = (_request$user2 = request.user) === null || _request$user2 === void 0 ? void 0 : _request$user2.full_name) !== null && _request$user$full_na !== void 0 ? _request$user$full_na : '';

  try {
    let timeline = {};

    if (timelineId != null) {
      const {
        eventIdToNoteIds,
        notes,
        noteIds,
        pinnedEventIds,
        pinnedEventsSaveObject,
        savedObjectId,
        version,
        ...savedTimeline
      } = await getBasicSavedTimeline(request, timelineId);
      timelineId = savedObjectId; // eslint-disable-line no-param-reassign

      timeline = savedTimeline;
    }

    const userFavoriteTimeline = {
      keySearch: userName != null ? convertStringToBase64(userName) : null,
      favoriteDate: new Date().valueOf(),
      fullName,
      userName
    };

    if (timeline.favorite != null) {
      const alreadyExistsTimelineFavoriteByUser = timeline.favorite.findIndex(user => user.userName === userName);
      timeline.favorite = alreadyExistsTimelineFavoriteByUser > -1 ? [...timeline.favorite.slice(0, alreadyExistsTimelineFavoriteByUser), ...timeline.favorite.slice(alreadyExistsTimelineFavoriteByUser + 1)] : [...timeline.favorite, userFavoriteTimeline];
    } else if (timeline.favorite == null) {
      timeline.favorite = [userFavoriteTimeline];
    }

    const persistResponse = await persistTimeline(request, timelineId, null, { ...timeline,
      templateTimelineId,
      templateTimelineVersion,
      timelineType
    });
    return {
      savedObjectId: persistResponse.timeline.savedObjectId,
      version: persistResponse.timeline.version,
      favorite: persistResponse.timeline.favorite != null ? persistResponse.timeline.favorite.filter(fav => fav.userName === userName) : [],
      templateTimelineId,
      templateTimelineVersion,
      timelineType
    };
  } catch (err) {
    if ((0, _fp.getOr)(null, 'output.statusCode', err) === 403) {
      return {
        savedObjectId: '',
        version: '',
        favorite: [],
        code: 403,
        message: err.message
      };
    }

    throw err;
  }
};

exports.persistFavorite = persistFavorite;

const persistTimeline = async (request, timelineId, version, timeline, isImmutable) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  const userInfo = isImmutable ? {
    username: 'Elastic'
  } : request.user;

  try {
    if (timelineId == null) {
      // Create new timeline
      const newTimeline = (0, _convert_saved_object_to_savedtimeline.convertSavedObjectToSavedTimeline)(await savedObjectsClient.create(_saved_object_mappings.timelineSavedObjectType, (0, _pick_saved_timeline.pickSavedTimeline)(timelineId, timeline, userInfo)));
      return {
        code: 200,
        message: 'success',
        timeline: newTimeline
      };
    } // Update Timeline


    await savedObjectsClient.update(_saved_object_mappings.timelineSavedObjectType, timelineId, (0, _pick_saved_timeline.pickSavedTimeline)(timelineId, timeline, userInfo), {
      version: version || undefined
    });
    return {
      code: 200,
      message: 'success',
      timeline: await getSavedTimeline(request, timelineId)
    };
  } catch (err) {
    if (timelineId != null && savedObjectsClient.errors.isConflictError(err)) {
      return {
        code: 409,
        message: err.message,
        timeline: await getSavedTimeline(request, timelineId)
      };
    } else if ((0, _fp.getOr)(null, 'output.statusCode', err) === 403) {
      const timelineToReturn = { ...timeline,
        savedObjectId: '',
        version: ''
      };
      return {
        code: 403,
        message: err.message,
        timeline: timelineToReturn
      };
    }

    throw err;
  }
};

exports.persistTimeline = persistTimeline;

const updatePartialSavedTimeline = async (request, timelineId, timeline) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  const currentSavedTimeline = await savedObjectsClient.get(_saved_object_mappings.timelineSavedObjectType, timelineId);
  return savedObjectsClient.update(_saved_object_mappings.timelineSavedObjectType, timelineId, (0, _pick_saved_timeline.pickSavedTimeline)(null, { ...timeline,
    dateRange: currentSavedTimeline.attributes.dateRange
  }, request.user));
};

const resetTimeline = async (request, timelineIds, timelineType) => {
  if (!timelineIds.length) {
    return Promise.reject(new Error('timelineIds is empty'));
  }

  await Promise.all(timelineIds.map(timelineId => Promise.all([note.deleteNoteByTimelineId(request, timelineId), pinnedEvent.deleteAllPinnedEventsOnTimeline(request, timelineId)])));
  const response = await Promise.all(timelineIds.map(timelineId => updatePartialSavedTimeline(request, timelineId, { ..._default_timeline.draftTimelineDefaults,
    timelineType
  })));
  return response;
};

exports.resetTimeline = resetTimeline;

const deleteTimeline = async (request, timelineIds) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  await Promise.all(timelineIds.map(timelineId => Promise.all([savedObjectsClient.delete(_saved_object_mappings.timelineSavedObjectType, timelineId), note.deleteNoteByTimelineId(request, timelineId), pinnedEvent.deleteAllPinnedEventsOnTimeline(request, timelineId)])));
};

exports.deleteTimeline = deleteTimeline;

const getBasicSavedTimeline = async (request, timelineId) => {
  const savedObjectsClient = request.context.core.savedObjects.client;
  const savedObject = await savedObjectsClient.get(_saved_object_mappings.timelineSavedObjectType, timelineId);
  return (0, _convert_saved_object_to_savedtimeline.convertSavedObjectToSavedTimeline)(savedObject);
};

const getSavedTimeline = async (request, timelineId) => {
  var _request$user$usernam2, _request$user3;

  const userName = (_request$user$usernam2 = (_request$user3 = request.user) === null || _request$user3 === void 0 ? void 0 : _request$user3.username) !== null && _request$user$usernam2 !== void 0 ? _request$user$usernam2 : _constants.UNAUTHENTICATED_USER;
  const savedObjectsClient = request.context.core.savedObjects.client;
  const savedObject = await savedObjectsClient.get(_saved_object_mappings.timelineSavedObjectType, timelineId);
  const timelineSaveObject = (0, _convert_saved_object_to_savedtimeline.convertSavedObjectToSavedTimeline)(savedObject);
  const timelineWithNotesAndPinnedEvents = await Promise.all([note.getNotesByTimelineId(request, timelineSaveObject.savedObjectId), pinnedEvent.getAllPinnedEventsByTimelineId(request, timelineSaveObject.savedObjectId), Promise.resolve(timelineSaveObject)]);
  const [notes, pinnedEvents, timeline] = timelineWithNotesAndPinnedEvents;
  return timelineWithReduxProperties(notes, pinnedEvents, timeline, userName);
};

const getAllSavedTimeline = async (request, options) => {
  var _request$user$usernam3, _request$user4;

  const userName = (_request$user$usernam3 = (_request$user4 = request.user) === null || _request$user4 === void 0 ? void 0 : _request$user4.username) !== null && _request$user$usernam3 !== void 0 ? _request$user$usernam3 : _constants.UNAUTHENTICATED_USER;
  const savedObjectsClient = request.context.core.savedObjects.client;

  if (options.searchFields != null && options.searchFields.includes('favorite.keySearch')) {
    options.search = `${options.search != null ? options.search : ''} ${userName != null ? convertStringToBase64(userName) : null}`;
  }

  const savedObjects = await savedObjectsClient.find(options);
  const timelinesWithNotesAndPinnedEvents = await Promise.all(savedObjects.saved_objects.map(async savedObject => {
    const timelineSaveObject = (0, _convert_saved_object_to_savedtimeline.convertSavedObjectToSavedTimeline)(savedObject);
    return Promise.all([note.getNotesByTimelineId(request, timelineSaveObject.savedObjectId), pinnedEvent.getAllPinnedEventsByTimelineId(request, timelineSaveObject.savedObjectId), Promise.resolve(timelineSaveObject)]);
  }));
  return {
    totalCount: savedObjects.total,
    timeline: timelinesWithNotesAndPinnedEvents.map(([notes, pinnedEvents, timeline]) => timelineWithReduxProperties(notes, pinnedEvents, timeline, userName))
  };
};

const convertStringToBase64 = text => Buffer.from(text).toString('base64'); // we have to use any here because the SavedObjectAttributes interface is like below
// export interface SavedObjectAttributes {
//   [key: string]: SavedObjectAttributes | string | number | boolean | null;
// }
// then this interface does not allow types without index signature
// this is limiting us with our type for now so the easy way was to use any


exports.convertStringToBase64 = convertStringToBase64;

const timelineWithReduxProperties = (notes, pinnedEvents, timeline, userName) => ({ ...timeline,
  favorite: timeline.favorite != null && userName != null ? timeline.favorite.filter(fav => fav.userName === userName) : [],
  eventIdToNoteIds: notes.filter(n => n.eventId != null),
  noteIds: notes.filter(n => n.eventId == null && n.noteId != null).map(n => n.noteId),
  notes,
  pinnedEventIds: pinnedEvents.map(e => e.eventId),
  pinnedEventsSaveObject: pinnedEvents
});

exports.timelineWithReduxProperties = timelineWithReduxProperties;

const getSelectedTimelines = async (request, timelineIds) => {
  var _exportedIds;

  const savedObjectsClient = request.context.core.savedObjects.client;
  let exportedIds = timelineIds;

  if (timelineIds == null || timelineIds.length === 0) {
    var _timelineIds$length;

    const {
      timeline: savedAllTimelines
    } = await getAllTimeline(request, false, {
      pageIndex: 1,
      pageSize: (_timelineIds$length = timelineIds === null || timelineIds === void 0 ? void 0 : timelineIds.length) !== null && _timelineIds$length !== void 0 ? _timelineIds$length : 0
    }, null, null, _types.TimelineStatus.active, null);
    exportedIds = savedAllTimelines.map(t => t.savedObjectId);
  }

  const savedObjects = await Promise.resolve(savedObjectsClient.bulkGet((_exportedIds = exportedIds) === null || _exportedIds === void 0 ? void 0 : _exportedIds.reduce((acc, timelineId) => [...acc, {
    id: timelineId,
    type: _saved_object_mappings.timelineSavedObjectType
  }], [])));
  const timelineObjects = savedObjects.saved_objects.reduce((acc, savedObject) => {
    return savedObject.error == null ? {
      errors: acc.errors,
      timelines: [...acc.timelines, (0, _convert_saved_object_to_savedtimeline.convertSavedObjectToSavedTimeline)(savedObject)]
    } : {
      errors: [...acc.errors, savedObject.error],
      timelines: acc.timelines
    };
  }, {
    timelines: [],
    errors: []
  });
  return timelineObjects;
};

exports.getSelectedTimelines = getSelectedTimelines;