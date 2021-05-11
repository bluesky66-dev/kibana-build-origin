"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldWildcardMatcher = fieldWildcardMatcher;
exports.fieldWildcardFilter = fieldWildcardFilter;
exports.makeRegEx = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @internal
const makeRegEx = (0, _lodash.memoize)(function makeRegEx(glob) {
  const globRegex = glob.split('*').map(_lodash.escapeRegExp).join('.*');
  return new RegExp(`^${globRegex}$`);
}); // Note that this will return an essentially noop function if globs is undefined.

exports.makeRegEx = makeRegEx;

function fieldWildcardMatcher(globs = [], metaFields = []) {
  return function matcher(val) {
    // do not test metaFields or keyword
    if (metaFields.indexOf(val) !== -1) {
      return false;
    }

    return globs.some(p => makeRegEx(p).test(`${val}`));
  };
} // Note that this will return an essentially noop function if globs is undefined.


function fieldWildcardFilter(globs = [], metaFields = []) {
  const matcher = fieldWildcardMatcher(globs, metaFields);
  return function filter(val) {
    return !matcher(val);
  };
}