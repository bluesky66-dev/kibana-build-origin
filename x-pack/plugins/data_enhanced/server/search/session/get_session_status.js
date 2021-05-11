"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSessionStatus = getSessionStatus;

var _common = require("../../../common");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getSessionStatus(session) {
  const searchStatuses = Object.values(session.idMapping);

  if (searchStatuses.some(item => item.status === _types.SearchStatus.ERROR)) {
    return _common.SearchSessionStatus.ERROR;
  } else if (searchStatuses.length > 0 && searchStatuses.every(item => item.status === _types.SearchStatus.COMPLETE)) {
    return _common.SearchSessionStatus.COMPLETE;
  } else {
    return _common.SearchSessionStatus.IN_PROGRESS;
  }
}