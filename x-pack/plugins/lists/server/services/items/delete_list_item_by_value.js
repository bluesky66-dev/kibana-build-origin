"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteListItemByValue = void 0;

var _utils = require("../utils");

var _get_list_item_by_values = require("./get_list_item_by_values");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteListItemByValue = async ({
  listId,
  value,
  type,
  callCluster,
  listItemIndex
}) => {
  const listItems = await (0, _get_list_item_by_values.getListItemByValues)({
    callCluster,
    listId,
    listItemIndex,
    type,
    value: [value]
  });
  const values = listItems.map(listItem => listItem.value);
  const filter = (0, _utils.getQueryFilterFromTypeValue)({
    listId,
    type,
    value: values
  });
  await callCluster('deleteByQuery', {
    body: {
      query: {
        bool: {
          filter
        }
      }
    },
    index: listItemIndex,
    refresh: 'wait_for'
  });
  return listItems;
};

exports.deleteListItemByValue = deleteListItemByValue;