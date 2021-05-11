"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchListItemByValues = void 0;

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const searchListItemByValues = async ({
  listId,
  callCluster,
  listItemIndex,
  type,
  value
}) => {
  const response = await callCluster('search', {
    body: {
      query: {
        bool: {
          filter: (0, _utils.getQueryFilterFromTypeValue)({
            listId,
            type,
            value
          })
        }
      }
    },
    ignoreUnavailable: true,
    index: listItemIndex,
    size: 10000 // TODO: This has a limit on the number which is 10,000 the default of Elastic but we might want to provide a way to increase that number

  });
  return (0, _utils.transformElasticNamedSearchToListItem)({
    response,
    type,
    value
  });
};

exports.searchListItemByValues = searchListItemByValues;