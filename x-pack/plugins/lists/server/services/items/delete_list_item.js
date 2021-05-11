"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteListItem = void 0;

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteListItem = async ({
  id,
  callCluster,
  listItemIndex
}) => {
  const listItem = await (0, _.getListItem)({
    callCluster,
    id,
    listItemIndex
  });

  if (listItem == null) {
    return null;
  } else {
    await callCluster('delete', {
      id,
      index: listItemIndex,
      refresh: 'wait_for'
    });
  }

  return listItem;
};

exports.deleteListItem = deleteListItem;