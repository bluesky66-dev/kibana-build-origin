"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simpleQueryContext = exports.nextPagination = void 0;

var _runtime_types = require("../../../../common/runtime_types");

var _query_context = require("./query_context");

var _helper = require("../helper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const nextPagination = key => {
  return {
    cursorDirection: _runtime_types.CursorDirection.AFTER,
    sortOrder: _runtime_types.SortOrder.ASC,
    cursorKey: key
  };
};

exports.nextPagination = nextPagination;

const simpleQueryContext = () => {
  return new _query_context.QueryContext((0, _helper.getUptimeESMockClient)().uptimeEsClient, '', '', nextPagination('something'), undefined, 0, '');
};

exports.simpleQueryContext = simpleQueryContext;