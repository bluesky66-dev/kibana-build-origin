"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getList = void 0;

var _transform_elastic_to_list = require("../utils/transform_elastic_to_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getList = async ({
  id,
  callCluster,
  listIndex
}) => {
  var _list$; // Note: This typing of response = await callCluster<SearchResponse<SearchEsListSchema>>
  // is because when you pass in seq_no_primary_term: true it does a "fall through" type and you have
  // to explicitly define the type <T>.


  const response = await callCluster('search', {
    body: {
      query: {
        term: {
          _id: id
        }
      }
    },
    ignoreUnavailable: true,
    index: listIndex,
    seq_no_primary_term: true
  });
  const list = (0, _transform_elastic_to_list.transformElasticToList)({
    response
  });
  return (_list$ = list[0]) !== null && _list$ !== void 0 ? _list$ : null;
};

exports.getList = getList;