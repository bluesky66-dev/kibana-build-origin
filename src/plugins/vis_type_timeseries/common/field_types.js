"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIELD_TYPES = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
let FIELD_TYPES;
exports.FIELD_TYPES = FIELD_TYPES;

(function (FIELD_TYPES) {
  FIELD_TYPES["BOOLEAN"] = "boolean";
  FIELD_TYPES["DATE"] = "date";
  FIELD_TYPES["GEO"] = "geo_point";
  FIELD_TYPES["NUMBER"] = "number";
  FIELD_TYPES["STRING"] = "string";
})(FIELD_TYPES || (exports.FIELD_TYPES = FIELD_TYPES = {}));