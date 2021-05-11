"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListItemByValue = void 0;

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getListItemByValue = async ({
  listId,
  callCluster,
  listItemIndex,
  type,
  value
}) => (0, _.getListItemByValues)({
  callCluster,
  listId,
  listItemIndex,
  type,
  value: [value]
});

exports.getListItemByValue = getListItemByValue;