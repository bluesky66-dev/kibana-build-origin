"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryFilterWithListId = exports.getQueryFilter = void 0;

var _server = require("../../../../../../src/plugins/data/server");

var _escape_query = require("./escape_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getQueryFilter = ({
  filter
}) => {
  const kqlQuery = {
    language: 'kuery',
    query: filter
  };
  const config = {
    allowLeadingWildcards: true,
    dateFormatTZ: 'Zulu',
    ignoreFilterIfFieldNotInIndex: false,
    queryStringOptions: {
      analyze_wildcard: true
    }
  };
  return _server.esQuery.buildEsQuery(undefined, kqlQuery, [], config);
};

exports.getQueryFilter = getQueryFilter;

const getQueryFilterWithListId = ({
  filter,
  listId
}) => {
  const escapedListId = (0, _escape_query.escapeQuotes)(listId);
  const filterWithListId = filter.trim() !== '' ? `list_id: "${escapedListId}" AND (${filter})` : `list_id: "${escapedListId}"`;
  return getQueryFilter({
    filter: filterWithListId
  });
};

exports.getQueryFilterWithListId = getQueryFilterWithListId;