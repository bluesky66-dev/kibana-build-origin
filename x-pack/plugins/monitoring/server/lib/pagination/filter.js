"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = filter;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function defaultFilterFn(value, query) {
  if (value.toLowerCase().includes(query.toLowerCase())) {
    return true;
  }

  return false;
}

function filter(data, queryText, fields, filterFn = defaultFilterFn) {
  return data.filter(item => {
    for (const field of fields) {
      if (filterFn((0, _lodash.get)(item, field, ''), queryText)) {
        return true;
      }
    }
  });
}