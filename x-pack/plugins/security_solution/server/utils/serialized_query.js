"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFilterQuery = void 0;

var _apolloServerErrors = require("apollo-server-errors");

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const parseFilterQuery = filterQuery => {
  try {
    if (filterQuery && (0, _fp.isString)(filterQuery) && !(0, _fp.isEmpty)(filterQuery)) {
      const parsedFilterQuery = JSON.parse(filterQuery);

      if (!parsedFilterQuery || !(0, _fp.isPlainObject)(parsedFilterQuery) || Array.isArray(parsedFilterQuery)) {
        throw new Error('expected value to be an object');
      }

      return parsedFilterQuery;
    }

    return {};
  } catch (err) {
    throw new _apolloServerErrors.UserInputError(`Failed to parse query: ${err}`, {
      query: filterQuery,
      originalError: err
    });
  }
};

exports.parseFilterQuery = parseFilterQuery;