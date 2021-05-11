"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionListClient = void 0;

var _error_with_status_code = require("../../error_with_status_code");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getExceptionListClient = context => {
  var _context$lists;

  const exceptionLists = (_context$lists = context.lists) === null || _context$lists === void 0 ? void 0 : _context$lists.getExceptionListClient();

  if (exceptionLists == null) {
    throw new _error_with_status_code.ErrorWithStatusCode('Exception lists is not found as a plugin', 404);
  } else {
    return exceptionLists;
  }
};

exports.getExceptionListClient = getExceptionListClient;