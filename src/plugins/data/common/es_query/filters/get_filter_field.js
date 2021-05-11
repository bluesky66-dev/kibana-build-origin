"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterField = void 0;

var _exists_filter = require("./exists_filter");

var _geo_bounding_box_filter = require("./geo_bounding_box_filter");

var _geo_polygon_filter = require("./geo_polygon_filter");

var _phrase_filter = require("./phrase_filter");

var _phrases_filter = require("./phrases_filter");

var _range_filter = require("./range_filter");

var _missing_filter = require("./missing_filter");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getFilterField = filter => {
  if ((0, _exists_filter.isExistsFilter)(filter)) {
    return (0, _exists_filter.getExistsFilterField)(filter);
  }

  if ((0, _geo_bounding_box_filter.isGeoBoundingBoxFilter)(filter)) {
    return (0, _geo_bounding_box_filter.getGeoBoundingBoxFilterField)(filter);
  }

  if ((0, _geo_polygon_filter.isGeoPolygonFilter)(filter)) {
    return (0, _geo_polygon_filter.getGeoPolygonFilterField)(filter);
  }

  if ((0, _phrase_filter.isPhraseFilter)(filter)) {
    return (0, _phrase_filter.getPhraseFilterField)(filter);
  }

  if ((0, _phrases_filter.isPhrasesFilter)(filter)) {
    return (0, _phrases_filter.getPhrasesFilterField)(filter);
  }

  if ((0, _range_filter.isRangeFilter)(filter)) {
    return (0, _range_filter.getRangeFilterField)(filter);
  }

  if ((0, _missing_filter.isMissingFilter)(filter)) {
    return (0, _missing_filter.getMissingFilterField)(filter);
  }

  return;
};

exports.getFilterField = getFilterField;