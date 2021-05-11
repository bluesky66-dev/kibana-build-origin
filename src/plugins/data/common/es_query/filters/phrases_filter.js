"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildPhrasesFilter = exports.getPhrasesFilterField = exports.isPhrasesFilter = void 0;

var _phrase_filter = require("./phrase_filter");

var _index = require("./index");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isPhrasesFilter = filter => {
  var _filter$meta;

  return (filter === null || filter === void 0 ? void 0 : (_filter$meta = filter.meta) === null || _filter$meta === void 0 ? void 0 : _filter$meta.type) === _index.FILTERS.PHRASES;
};

exports.isPhrasesFilter = isPhrasesFilter;

const getPhrasesFilterField = filter => {
  // Phrases is a newer filter type that has always been created via a constructor that ensures
  // `meta.key` is set to the field name
  return filter.meta.key;
}; // Creates a filter where the given field matches one or more of the given values
// params should be an array of values


exports.getPhrasesFilterField = getPhrasesFilterField;

const buildPhrasesFilter = (field, params, indexPattern) => {
  const index = indexPattern.id;
  const type = _index.FILTERS.PHRASES;
  const key = field.name;

  const format = (f, value) => f && f.format && f.format.convert ? f.format.convert(value) : value;

  const value = params.map(v => format(field, v)).join(', ');
  let should;

  if (field.scripted) {
    should = params.map(v => ({
      script: (0, _phrase_filter.getPhraseScript)(field, v)
    }));
  } else {
    should = params.map(v => ({
      match_phrase: {
        [field.name]: v
      }
    }));
  }

  return {
    meta: {
      index,
      type,
      key,
      value,
      params
    },
    query: {
      bool: {
        should,
        minimum_should_match: 1
      }
    }
  };
};

exports.buildPhrasesFilter = buildPhrasesFilter;