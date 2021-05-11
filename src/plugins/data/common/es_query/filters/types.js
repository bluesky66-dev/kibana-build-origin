"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FILTERS = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// Any filter associated with a field (used in the filter bar/editor)
let FILTERS;
exports.FILTERS = FILTERS;

(function (FILTERS) {
  FILTERS["CUSTOM"] = "custom";
  FILTERS["PHRASES"] = "phrases";
  FILTERS["PHRASE"] = "phrase";
  FILTERS["EXISTS"] = "exists";
  FILTERS["MATCH_ALL"] = "match_all";
  FILTERS["MISSING"] = "missing";
  FILTERS["QUERY_STRING"] = "query_string";
  FILTERS["RANGE"] = "range";
  FILTERS["GEO_BOUNDING_BOX"] = "geo_bounding_box";
  FILTERS["GEO_POLYGON"] = "geo_polygon";
  FILTERS["SPATIAL_FILTER"] = "spatial_filter";
})(FILTERS || (exports.FILTERS = FILTERS = {}));