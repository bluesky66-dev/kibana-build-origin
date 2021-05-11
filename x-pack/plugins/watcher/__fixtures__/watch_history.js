"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWatchHistory = void 0;

var _jest = require("@kbn/test/jest");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getWatchHistory = ({
  startTime = '2019-06-03T19:44:11.088Z',
  id = (0, _jest.getRandomString)(),
  watchId = (0, _jest.getRandomString)(),
  watchStatus = {
    state: 'OK'
  },
  details = {}
} = {}) => ({
  startTime,
  id,
  watchId,
  watchStatus,
  details
});

exports.getWatchHistory = getWatchHistory;