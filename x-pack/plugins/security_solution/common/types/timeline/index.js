"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelineTabs = exports.importTimelineResultSchema = exports.AllTimelineSavedObjectRuntimeType = exports.TimelineErrorResponseType = exports.TimelineResponseType = exports.TimelineSavedToReturnObjectRuntimeType = exports.TimelineSavedObjectRuntimeType = exports.TimelineIdLiteralRt = exports.TimelineId = exports.SavedTimelineRuntimeType = exports.TimelineTypeLiteralWithNullRt = exports.TimelineTypeLiteralRt = exports.TimelineType = exports.TemplateTimelineTypeLiteralWithNullRt = exports.TemplateTimelineTypeLiteralRt = exports.TemplateTimelineType = exports.RowRendererIdRuntimeType = exports.RowRendererId = exports.TimelineStatusLiteralRt = exports.TimelineStatus = exports.DataProviderTypeLiteralRt = exports.DataProviderType = void 0;

var runtimeTypes = _interopRequireWildcard(require("io-ts"));

var _utility_types = require("../../utility_types");

var _note = require("./note");

var _pinned_event = require("./pinned_event");

var _schemas = require("../../detection_engine/schemas/common/schemas");

var _types = require("../../detection_engine/schemas/types");

var _error_schema = require("../../detection_engine/schemas/response/error_schema");

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

/*
 *  ColumnHeader Types
 */


const SavedColumnHeaderRuntimeType = runtimeTypes.partial({
  aggregatable: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  category: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  columnHeaderType: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  description: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  example: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  indexes: (0, _utility_types.unionWithNullType)(runtimeTypes.array(runtimeTypes.string)),
  id: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  name: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  placeholder: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  searchable: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  type: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
/*
 *  DataProvider Types
 */

const SavedDataProviderQueryMatchBasicRuntimeType = runtimeTypes.partial({
  field: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  displayField: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  value: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  displayValue: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  operator: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedDataProviderQueryMatchRuntimeType = runtimeTypes.partial({
  id: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  name: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  enabled: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  excluded: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  kqlQuery: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  queryMatch: (0, _utility_types.unionWithNullType)(SavedDataProviderQueryMatchBasicRuntimeType)
});
let DataProviderType;
exports.DataProviderType = DataProviderType;

(function (DataProviderType) {
  DataProviderType["default"] = "default";
  DataProviderType["template"] = "template";
})(DataProviderType || (exports.DataProviderType = DataProviderType = {}));

const DataProviderTypeLiteralRt = runtimeTypes.union([runtimeTypes.literal(DataProviderType.default), runtimeTypes.literal(DataProviderType.template)]);
exports.DataProviderTypeLiteralRt = DataProviderTypeLiteralRt;
const SavedDataProviderRuntimeType = runtimeTypes.partial({
  id: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  name: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  enabled: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  excluded: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  kqlQuery: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  queryMatch: (0, _utility_types.unionWithNullType)(SavedDataProviderQueryMatchBasicRuntimeType),
  and: (0, _utility_types.unionWithNullType)(runtimeTypes.array(SavedDataProviderQueryMatchRuntimeType)),
  type: (0, _utility_types.unionWithNullType)(DataProviderTypeLiteralRt)
});
/*
 *  Filters Types
 */

const SavedFilterMetaRuntimeType = runtimeTypes.partial({
  alias: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  controlledBy: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  disabled: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  field: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  formattedValue: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  index: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  key: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  negate: (0, _utility_types.unionWithNullType)(runtimeTypes.boolean),
  params: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  type: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  value: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedFilterRuntimeType = runtimeTypes.partial({
  exists: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  meta: (0, _utility_types.unionWithNullType)(SavedFilterMetaRuntimeType),
  match_all: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  missing: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  query: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  range: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  script: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
/*
 *  eqlOptionsQuery -> filterQuery Types
 */

const EqlOptionsRuntimeType = runtimeTypes.partial({
  eventCategoryField: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  query: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  tiebreakerField: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  timestampField: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  size: (0, _utility_types.unionWithNullType)(runtimeTypes.union([runtimeTypes.string, runtimeTypes.number]))
});
/*
 *  kqlQuery -> filterQuery Types
 */

const SavedKueryFilterQueryRuntimeType = runtimeTypes.partial({
  kind: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  expression: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedSerializedFilterQueryQueryRuntimeType = runtimeTypes.partial({
  kuery: (0, _utility_types.unionWithNullType)(SavedKueryFilterQueryRuntimeType),
  serializedQuery: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedFilterQueryQueryRuntimeType = runtimeTypes.partial({
  filterQuery: (0, _utility_types.unionWithNullType)(SavedSerializedFilterQueryQueryRuntimeType)
});
/*
 *  DatePicker Range Types
 */

const SavedDateRangePickerRuntimeType = runtimeTypes.partial({
  /* Before the change of all timestamp to ISO string the values of start and from
   * attributes where a number. Specifically UNIX timestamps.
   * To support old timeline's saved object we need to add the number io-ts type
   */
  start: (0, _utility_types.unionWithNullType)(runtimeTypes.union([runtimeTypes.string, runtimeTypes.number])),
  end: (0, _utility_types.unionWithNullType)(runtimeTypes.union([runtimeTypes.string, runtimeTypes.number]))
});
/*
 *  Favorite Types
 */

const SavedFavoriteRuntimeType = runtimeTypes.partial({
  keySearch: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  favoriteDate: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  fullName: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  userName: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
/*
 *  Sort Types
 */

const SavedSortObject = runtimeTypes.partial({
  columnId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  columnType: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  sortDirection: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
const SavedSortRuntimeType = runtimeTypes.union([runtimeTypes.array(SavedSortObject), SavedSortObject]);
/*
 *  Timeline Statuses
 */

let TimelineStatus;
exports.TimelineStatus = TimelineStatus;

(function (TimelineStatus) {
  TimelineStatus["active"] = "active";
  TimelineStatus["draft"] = "draft";
  TimelineStatus["immutable"] = "immutable";
})(TimelineStatus || (exports.TimelineStatus = TimelineStatus = {}));

const TimelineStatusLiteralRt = runtimeTypes.union([runtimeTypes.literal(TimelineStatus.active), runtimeTypes.literal(TimelineStatus.draft), runtimeTypes.literal(TimelineStatus.immutable)]);
exports.TimelineStatusLiteralRt = TimelineStatusLiteralRt;
const TimelineStatusLiteralWithNullRt = (0, _utility_types.unionWithNullType)(TimelineStatusLiteralRt);
let RowRendererId;
exports.RowRendererId = RowRendererId;

(function (RowRendererId) {
  RowRendererId["alerts"] = "alerts";
  RowRendererId["auditd"] = "auditd";
  RowRendererId["auditd_file"] = "auditd_file";
  RowRendererId["library"] = "library";
  RowRendererId["netflow"] = "netflow";
  RowRendererId["plain"] = "plain";
  RowRendererId["registry"] = "registry";
  RowRendererId["suricata"] = "suricata";
  RowRendererId["system"] = "system";
  RowRendererId["system_dns"] = "system_dns";
  RowRendererId["system_endgame_process"] = "system_endgame_process";
  RowRendererId["system_file"] = "system_file";
  RowRendererId["system_fim"] = "system_fim";
  RowRendererId["system_security_event"] = "system_security_event";
  RowRendererId["system_socket"] = "system_socket";
  RowRendererId["zeek"] = "zeek";
})(RowRendererId || (exports.RowRendererId = RowRendererId = {}));

const RowRendererIdRuntimeType = (0, _utility_types.stringEnum)(RowRendererId, 'RowRendererId');
/**
 * Timeline template type
 */

exports.RowRendererIdRuntimeType = RowRendererIdRuntimeType;
let TemplateTimelineType;
exports.TemplateTimelineType = TemplateTimelineType;

(function (TemplateTimelineType) {
  TemplateTimelineType["elastic"] = "elastic";
  TemplateTimelineType["custom"] = "custom";
})(TemplateTimelineType || (exports.TemplateTimelineType = TemplateTimelineType = {}));

const TemplateTimelineTypeLiteralRt = runtimeTypes.union([runtimeTypes.literal(TemplateTimelineType.elastic), runtimeTypes.literal(TemplateTimelineType.custom)]);
exports.TemplateTimelineTypeLiteralRt = TemplateTimelineTypeLiteralRt;
const TemplateTimelineTypeLiteralWithNullRt = (0, _utility_types.unionWithNullType)(TemplateTimelineTypeLiteralRt);
exports.TemplateTimelineTypeLiteralWithNullRt = TemplateTimelineTypeLiteralWithNullRt;
/*
 *  Timeline Types
 */

let TimelineType;
exports.TimelineType = TimelineType;

(function (TimelineType) {
  TimelineType["default"] = "default";
  TimelineType["template"] = "template";
})(TimelineType || (exports.TimelineType = TimelineType = {}));

const TimelineTypeLiteralRt = runtimeTypes.union([runtimeTypes.literal(TimelineType.template), runtimeTypes.literal(TimelineType.default)]);
exports.TimelineTypeLiteralRt = TimelineTypeLiteralRt;
const TimelineTypeLiteralWithNullRt = (0, _utility_types.unionWithNullType)(TimelineTypeLiteralRt);
exports.TimelineTypeLiteralWithNullRt = TimelineTypeLiteralWithNullRt;
const SavedTimelineRuntimeType = runtimeTypes.partial({
  columns: (0, _utility_types.unionWithNullType)(runtimeTypes.array(SavedColumnHeaderRuntimeType)),
  dataProviders: (0, _utility_types.unionWithNullType)(runtimeTypes.array(SavedDataProviderRuntimeType)),
  description: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  eqlOptions: (0, _utility_types.unionWithNullType)(EqlOptionsRuntimeType),
  eventType: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  excludedRowRendererIds: (0, _utility_types.unionWithNullType)(runtimeTypes.array(RowRendererIdRuntimeType)),
  favorite: (0, _utility_types.unionWithNullType)(runtimeTypes.array(SavedFavoriteRuntimeType)),
  filters: (0, _utility_types.unionWithNullType)(runtimeTypes.array(SavedFilterRuntimeType)),
  indexNames: (0, _utility_types.unionWithNullType)(runtimeTypes.array(runtimeTypes.string)),
  kqlMode: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  kqlQuery: (0, _utility_types.unionWithNullType)(SavedFilterQueryQueryRuntimeType),
  title: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  templateTimelineId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  templateTimelineVersion: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  timelineType: (0, _utility_types.unionWithNullType)(TimelineTypeLiteralRt),
  dateRange: (0, _utility_types.unionWithNullType)(SavedDateRangePickerRuntimeType),
  savedQueryId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  sort: (0, _utility_types.unionWithNullType)(SavedSortRuntimeType),
  status: (0, _utility_types.unionWithNullType)(TimelineStatusLiteralRt),
  created: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  createdBy: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  updated: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  updatedBy: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
});
exports.SavedTimelineRuntimeType = SavedTimelineRuntimeType;
/*
 *  Timeline IDs
 */

let TimelineId;
exports.TimelineId = TimelineId;

(function (TimelineId) {
  TimelineId["hostsPageEvents"] = "hosts-page-events";
  TimelineId["hostsPageExternalAlerts"] = "hosts-page-external-alerts";
  TimelineId["detectionsRulesDetailsPage"] = "detections-rules-details-page";
  TimelineId["detectionsPage"] = "detections-page";
  TimelineId["networkPageExternalAlerts"] = "network-page-external-alerts";
  TimelineId["active"] = "timeline-1";
  TimelineId["casePage"] = "timeline-case";
  TimelineId["test"] = "test";
  TimelineId["alternateTest"] = "alternateTest";
})(TimelineId || (exports.TimelineId = TimelineId = {}));

const TimelineIdLiteralRt = runtimeTypes.union([runtimeTypes.literal(TimelineId.hostsPageEvents), runtimeTypes.literal(TimelineId.hostsPageExternalAlerts), runtimeTypes.literal(TimelineId.detectionsRulesDetailsPage), runtimeTypes.literal(TimelineId.detectionsPage), runtimeTypes.literal(TimelineId.networkPageExternalAlerts), runtimeTypes.literal(TimelineId.active), runtimeTypes.literal(TimelineId.test)]);
exports.TimelineIdLiteralRt = TimelineIdLiteralRt;
/**
 * Timeline Saved object type with metadata
 */

const TimelineSavedObjectRuntimeType = runtimeTypes.intersection([runtimeTypes.type({
  id: runtimeTypes.string,
  attributes: SavedTimelineRuntimeType,
  version: runtimeTypes.string
}), runtimeTypes.partial({
  savedObjectId: runtimeTypes.string
})]);
exports.TimelineSavedObjectRuntimeType = TimelineSavedObjectRuntimeType;
const TimelineSavedToReturnObjectRuntimeType = runtimeTypes.intersection([SavedTimelineRuntimeType, runtimeTypes.type({
  savedObjectId: runtimeTypes.string,
  version: runtimeTypes.string
}), runtimeTypes.partial({
  eventIdToNoteIds: runtimeTypes.array(_note.NoteSavedObjectToReturnRuntimeType),
  noteIds: runtimeTypes.array(runtimeTypes.string),
  notes: runtimeTypes.array(_note.NoteSavedObjectToReturnRuntimeType),
  pinnedEventIds: runtimeTypes.array(runtimeTypes.string),
  pinnedEventsSaveObject: runtimeTypes.array(_pinned_event.PinnedEventToReturnSavedObjectRuntimeType)
})]);
exports.TimelineSavedToReturnObjectRuntimeType = TimelineSavedToReturnObjectRuntimeType;
/**
 * All Timeline Saved object type with metadata
 */

const TimelineResponseType = runtimeTypes.type({
  data: runtimeTypes.type({
    persistTimeline: runtimeTypes.intersection([runtimeTypes.partial({
      code: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
      message: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
    }), runtimeTypes.type({
      timeline: TimelineSavedToReturnObjectRuntimeType
    })])
  })
});
exports.TimelineResponseType = TimelineResponseType;
const TimelineErrorResponseType = runtimeTypes.type({
  status_code: runtimeTypes.number,
  message: runtimeTypes.string
});
exports.TimelineErrorResponseType = TimelineErrorResponseType;
/**
 * All Timeline Saved object type with metadata
 */

const AllTimelineSavedObjectRuntimeType = runtimeTypes.type({
  total: runtimeTypes.number,
  data: TimelineSavedToReturnObjectRuntimeType
});
exports.AllTimelineSavedObjectRuntimeType = AllTimelineSavedObjectRuntimeType;
const importTimelineResultSchema = runtimeTypes.exact(runtimeTypes.type({
  success: _schemas.success,
  success_count: _schemas.success_count,
  timelines_installed: _types.PositiveInteger,
  timelines_updated: _types.PositiveInteger,
  errors: runtimeTypes.array(_error_schema.errorSchema)
}));
exports.importTimelineResultSchema = importTimelineResultSchema;
let TimelineTabs; // eslint-disable-next-line @typescript-eslint/no-explicit-any

exports.TimelineTabs = TimelineTabs;

(function (TimelineTabs) {
  TimelineTabs["query"] = "query";
  TimelineTabs["graph"] = "graph";
  TimelineTabs["notes"] = "notes";
  TimelineTabs["pinned"] = "pinned";
  TimelineTabs["eql"] = "eql";
})(TimelineTabs || (exports.TimelineTabs = TimelineTabs = {}));