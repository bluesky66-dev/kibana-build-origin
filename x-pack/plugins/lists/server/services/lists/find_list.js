"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findList = void 0;

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findList = async ({
  callCluster,
  currentIndexPosition,
  filter,
  page,
  perPage,
  searchAfter,
  sortField,
  listIndex,
  sortOrder
}) => {
  const query = (0, _utils.getQueryFilter)({
    filter
  });
  const scroll = await (0, _utils.scrollToStartPage)({
    callCluster,
    currentIndexPosition,
    filter,
    hopSize: 100,
    index: listIndex,
    page,
    perPage,
    searchAfter,
    sortField,
    sortOrder
  });
  const {
    count
  } = await callCluster('count', {
    body: {
      query
    },
    ignoreUnavailable: true,
    index: listIndex
  });

  if (scroll.validSearchAfterFound) {
    // Note: This typing of response = await callCluster<SearchResponse<SearchEsListSchema>>
    // is because when you pass in seq_no_primary_term: true it does a "fall through" type and you have
    // to explicitly define the type <T>.
    const response = await callCluster('search', {
      body: {
        query,
        search_after: scroll.searchAfter,
        sort: (0, _utils.getSortWithTieBreaker)({
          sortField,
          sortOrder
        })
      },
      ignoreUnavailable: true,
      index: listIndex,
      seq_no_primary_term: true,
      size: perPage
    });
    return {
      cursor: (0, _utils.encodeCursor)({
        page,
        perPage,
        searchAfter: (0, _utils.getSearchAfterWithTieBreaker)({
          response,
          sortField
        })
      }),
      data: (0, _utils.transformElasticToList)({
        response
      }),
      page,
      per_page: perPage,
      total: count
    };
  } else {
    return {
      cursor: (0, _utils.encodeCursor)({
        page,
        perPage,
        searchAfter: undefined
      }),
      data: [],
      page,
      per_page: perPage,
      total: count
    };
  }
};

exports.findList = findList;