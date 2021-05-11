"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BUCKET_TYPES = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let BUCKET_TYPES;
exports.BUCKET_TYPES = BUCKET_TYPES;

(function (BUCKET_TYPES) {
  BUCKET_TYPES["FILTER"] = "filter";
  BUCKET_TYPES["FILTERS"] = "filters";
  BUCKET_TYPES["HISTOGRAM"] = "histogram";
  BUCKET_TYPES["IP_RANGE"] = "ip_range";
  BUCKET_TYPES["DATE_RANGE"] = "date_range";
  BUCKET_TYPES["RANGE"] = "range";
  BUCKET_TYPES["TERMS"] = "terms";
  BUCKET_TYPES["SIGNIFICANT_TERMS"] = "significant_terms";
  BUCKET_TYPES["GEOHASH_GRID"] = "geohash_grid";
  BUCKET_TYPES["GEOTILE_GRID"] = "geotile_grid";
  BUCKET_TYPES["DATE_HISTOGRAM"] = "date_histogram";
})(BUCKET_TYPES || (exports.BUCKET_TYPES = BUCKET_TYPES = {}));