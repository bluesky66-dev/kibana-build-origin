"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListItem = void 0;

var _utils = require("../utils");

var _find_source_type = require("../utils/find_source_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getListItem = async ({
  id,
  callCluster,
  listItemIndex
}) => {
  // Note: This typing of response = await callCluster<SearchResponse<SearchEsListSchema>>
  // is because when you pass in seq_no_primary_term: true it does a "fall through" type and you have
  // to explicitly define the type <T>.
  const listItemES = await callCluster('search', {
    body: {
      query: {
        term: {
          _id: id
        }
      }
    },
    ignoreUnavailable: true,
    index: listItemIndex,
    seq_no_primary_term: true
  });

  if (listItemES.hits.hits.length) {
    const type = (0, _find_source_type.findSourceType)(listItemES.hits.hits[0]._source);

    if (type != null) {
      const listItems = (0, _utils.transformElasticToListItem)({
        response: listItemES,
        type
      });
      return listItems[0];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

exports.getListItem = getListItem;