"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchResultIndexAfterTime = exports.getSearchResultIndexBeforeTime = exports.getSearchResultKey = void 0;

var _d3Array = require("d3-array");

var _time = require("../time");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getSearchResultKey = result => ({
  gid: result.gid,
  tiebreaker: result.fields.tiebreaker,
  time: result.fields.time
});

exports.getSearchResultKey = getSearchResultKey;
const searchResultTimeBisector = (0, _d3Array.bisector)((0, _time.compareToTimeKey)(getSearchResultKey));
const getSearchResultIndexBeforeTime = searchResultTimeBisector.left;
exports.getSearchResultIndexBeforeTime = getSearchResultIndexBeforeTime;
const getSearchResultIndexAfterTime = searchResultTimeBisector.right;
exports.getSearchResultIndexAfterTime = getSearchResultIndexAfterTime;