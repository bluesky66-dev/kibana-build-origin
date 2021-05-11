"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatHitProvider = formatHitProvider;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const formattedCache = new WeakMap();
const partialFormattedCache = new WeakMap(); // Takes a hit, merges it with any stored/scripted fields, and with the metaFields
// returns a formatted version

function formatHitProvider(indexPattern, defaultFormat) {
  function convert(hit, val, fieldName, type = 'html') {
    const field = indexPattern.fields.getByName(fieldName);
    const format = field ? indexPattern.getFormatterForField(field) : defaultFormat;
    return format.convert(val, type, {
      field,
      hit,
      indexPattern
    });
  }

  function formatHit(hit, type = 'html') {
    if (type === 'text') {
      // formatHit of type text is for react components to get rid of <span ng-non-bindable>
      // since it's currently just used at the discover's doc view table, caching is not necessary
      const flattened = indexPattern.flattenHit(hit);
      const result = {};

      for (const [key, value] of Object.entries(flattened)) {
        result[key] = convert(hit, value, key, type);
      }

      return result;
    }

    const cached = formattedCache.get(hit);

    if (cached) {
      return cached;
    } // use and update the partial cache, but don't rewrite it.
    // _source is stored in partialFormattedCache but not formattedCache


    const partials = partialFormattedCache.get(hit) || {};
    partialFormattedCache.set(hit, partials);
    const cache = {};
    formattedCache.set(hit, cache);

    _lodash.default.forOwn(indexPattern.flattenHit(hit), function (val, fieldName) {
      // sync the formatted and partial cache
      if (!fieldName) {
        return;
      }

      const formatted = partials[fieldName] == null ? convert(hit, val, fieldName) : partials[fieldName];
      cache[fieldName] = partials[fieldName] = formatted;
    });

    return cache;
  }

  formatHit.formatField = function (hit, fieldName) {
    let partials = partialFormattedCache.get(hit);

    if (partials && partials[fieldName] != null) {
      return partials[fieldName];
    }

    if (!partials) {
      partials = {};
      partialFormattedCache.set(hit, partials);
    }

    const val = fieldName === '_source' ? hit._source : indexPattern.flattenHit(hit)[fieldName];
    return convert(hit, val, fieldName);
  };

  return formatHit;
}