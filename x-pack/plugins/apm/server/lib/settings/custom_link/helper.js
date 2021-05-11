"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromESFormat = fromESFormat;
exports.toESFormat = toESFormat;
exports.splitFilterValueByComma = splitFilterValueByComma;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function fromESFormat(customLinkES) {
  const {
    id,
    label,
    url,
    '@timestamp': timestamp,
    ...filters
  } = customLinkES;
  return {
    id,
    '@timestamp': timestamp,
    label,
    url,
    filters: Object.entries(filters).map(([key, value]) => ({
      key: key,
      value: (0, _lodash.isEmpty)(value) ? '' : value.join()
    }))
  };
}

function toESFormat(customLink) {
  const {
    label,
    url,
    filters = []
  } = customLink;
  const ESFilters = filters.filter(({
    key,
    value
  }) => key && value).reduce((acc, {
    key,
    value
  }) => {
    acc[key] = splitFilterValueByComma(value);
    return acc;
  }, {});
  return {
    label,
    url,
    ...ESFilters
  };
}

function splitFilterValueByComma(filterValue) {
  return filterValue.split(',').map(v => v.trim()).filter(v => v);
}