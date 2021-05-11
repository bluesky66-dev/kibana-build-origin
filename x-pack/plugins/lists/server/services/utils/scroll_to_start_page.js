"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrollToStartPage = void 0;

var _calculate_scroll_math = require("./calculate_scroll_math");

var _get_search_after_scroll = require("./get_search_after_scroll");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const scrollToStartPage = async ({
  callCluster,
  filter,
  hopSize,
  currentIndexPosition,
  searchAfter,
  page,
  perPage,
  sortOrder,
  sortField,
  index
}) => {
  const {
    hops,
    leftOverAfterHops
  } = (0, _calculate_scroll_math.calculateScrollMath)({
    currentIndexPosition,
    hopSize,
    page,
    perPage
  });

  if (hops === 0 && leftOverAfterHops === 0 && currentIndexPosition === 0) {
    // We want to use a valid searchAfter of undefined to start at the start of our list
    return {
      searchAfter: undefined,
      validSearchAfterFound: true
    };
  } else if (hops === 0 && leftOverAfterHops === 0 && currentIndexPosition > 0) {
    return {
      searchAfter,
      validSearchAfterFound: true
    };
  } else if (hops > 0) {
    const scroll = await (0, _get_search_after_scroll.getSearchAfterScroll)({
      callCluster,
      filter,
      hopSize,
      hops,
      index,
      searchAfter,
      sortField,
      sortOrder
    });

    if (scroll.validSearchAfterFound && leftOverAfterHops > 0) {
      return (0, _get_search_after_scroll.getSearchAfterScroll)({
        callCluster,
        filter,
        hopSize: leftOverAfterHops,
        hops: 1,
        index,
        searchAfter: scroll.searchAfter,
        sortField,
        sortOrder
      });
    } else {
      return scroll;
    }
  } else {
    return (0, _get_search_after_scroll.getSearchAfterScroll)({
      callCluster,
      filter,
      hopSize: leftOverAfterHops,
      hops: 1,
      index,
      searchAfter,
      sortField,
      sortOrder
    });
  }
};

exports.scrollToStartPage = scrollToStartPage;