"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoBoundingBoxFilterField = exports.isGeoBoundingBoxFilter = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isGeoBoundingBoxFilter = filter => filter && filter.geo_bounding_box;

exports.isGeoBoundingBoxFilter = isGeoBoundingBoxFilter;

const getGeoBoundingBoxFilterField = filter => {
  return filter.geo_bounding_box && Object.keys(filter.geo_bounding_box).find(key => key !== 'ignore_unmapped');
};

exports.getGeoBoundingBoxFilterField = getGeoBoundingBoxFilterField;