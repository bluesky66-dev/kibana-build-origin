"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.itemsPerSearchOrUndefined = exports.items_per_search = exports.concurrentSearchesOrUndefined = exports.concurrent_searches = exports.threatLanguageOrUndefined = exports.threat_language = exports.threatIndexOrUndefined = exports.threat_index = exports.threatMappingOrUndefined = exports.threat_mapping = exports.threatMap = exports.threatMappingEntries = exports.threatMapEntry = exports.threatFiltersOrUndefined = exports.threat_filters = exports.threatIndicatorPathOrUndefined = exports.threat_indicator_path = exports.threatQueryOrUndefined = exports.threat_query = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _schemas = require("../common/schemas");

var _non_empty_array = require("./non_empty_array");

var _non_empty_string = require("./non_empty_string");

var _positive_integer_greater_than_zero = require("./positive_integer_greater_than_zero");

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

/* eslint-disable @typescript-eslint/naming-convention */


const threat_query = t.string;
exports.threat_query = threat_query;
const threatQueryOrUndefined = t.union([threat_query, t.undefined]);
exports.threatQueryOrUndefined = threatQueryOrUndefined;
const threat_indicator_path = t.string;
exports.threat_indicator_path = threat_indicator_path;
const threatIndicatorPathOrUndefined = t.union([threat_indicator_path, t.undefined]);
exports.threatIndicatorPathOrUndefined = threatIndicatorPathOrUndefined;
const threat_filters = t.array(t.unknown); // Filters are not easily type-able yet

exports.threat_filters = threat_filters;
const threatFiltersOrUndefined = t.union([threat_filters, t.undefined]);
exports.threatFiltersOrUndefined = threatFiltersOrUndefined;
const threatMapEntry = t.exact(t.type({
  field: _non_empty_string.NonEmptyString,
  type: t.keyof({
    mapping: null
  }),
  value: _non_empty_string.NonEmptyString
}));
exports.threatMapEntry = threatMapEntry;
const threatMappingEntries = t.array(threatMapEntry);
exports.threatMappingEntries = threatMappingEntries;
const threatMap = t.exact(t.type({
  entries: threatMappingEntries
}));
exports.threatMap = threatMap;
const threat_mapping = (0, _non_empty_array.NonEmptyArray)(threatMap, 'NonEmptyArray<ThreatMap>');
exports.threat_mapping = threat_mapping;
const threatMappingOrUndefined = t.union([threat_mapping, t.undefined]);
exports.threatMappingOrUndefined = threatMappingOrUndefined;
const threat_index = t.array(t.string);
exports.threat_index = threat_index;
const threatIndexOrUndefined = t.union([threat_index, t.undefined]);
exports.threatIndexOrUndefined = threatIndexOrUndefined;
const threat_language = t.union([_schemas.language, t.undefined]);
exports.threat_language = threat_language;
const threatLanguageOrUndefined = t.union([threat_language, t.undefined]);
exports.threatLanguageOrUndefined = threatLanguageOrUndefined;
const concurrent_searches = _positive_integer_greater_than_zero.PositiveIntegerGreaterThanZero;
exports.concurrent_searches = concurrent_searches;
const concurrentSearchesOrUndefined = t.union([concurrent_searches, t.undefined]);
exports.concurrentSearchesOrUndefined = concurrentSearchesOrUndefined;
const items_per_search = _positive_integer_greater_than_zero.PositiveIntegerGreaterThanZero;
exports.items_per_search = items_per_search;
const itemsPerSearchOrUndefined = t.union([items_per_search, t.undefined]);
exports.itemsPerSearchOrUndefined = itemsPerSearchOrUndefined;