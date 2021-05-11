"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterMatchesIndex = filterMatchesIndex;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * TODO: We should base this on something better than `filter.meta.key`. We should probably modify
 * this to check if `filter.meta.index` matches `indexPattern.id` instead, but that's a breaking
 * change.
 */
function filterMatchesIndex(filter, indexPattern) {
  var _filter$meta, _filter$meta2;

  if (!((_filter$meta = filter.meta) !== null && _filter$meta !== void 0 && _filter$meta.key) || !indexPattern) {
    return true;
  } // Fixes https://github.com/elastic/kibana/issues/89878
  // Custom filters may refer multiple fields. Validate the index id only.


  if (((_filter$meta2 = filter.meta) === null || _filter$meta2 === void 0 ? void 0 : _filter$meta2.type) === 'custom') {
    return filter.meta.index === indexPattern.id;
  }

  return indexPattern.fields.some(field => field.name === filter.meta.key);
}