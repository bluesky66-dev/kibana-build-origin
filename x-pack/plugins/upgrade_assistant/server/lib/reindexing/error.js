"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = exports.createErrorFactory = exports.ReindexError = void 0;

var _error_symbols = require("./error_symbols");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ReindexError extends Error {
  constructor(message, symbol) {
    super(message);
    this.symbol = symbol;
  }

}

exports.ReindexError = ReindexError;

const createErrorFactory = symbol => message => {
  return new ReindexError(message, symbol);
};

exports.createErrorFactory = createErrorFactory;
const error = {
  indexNotFound: createErrorFactory(_error_symbols.IndexNotFound),
  accessForbidden: createErrorFactory(_error_symbols.AccessForbidden),
  cannotCreateIndex: createErrorFactory(_error_symbols.CannotCreateIndex),
  reindexTaskFailed: createErrorFactory(_error_symbols.ReindexTaskFailed),
  reindexTaskCannotBeDeleted: createErrorFactory(_error_symbols.ReindexTaskCannotBeDeleted),
  reindexAlreadyInProgress: createErrorFactory(_error_symbols.ReindexAlreadyInProgress),
  reindexSystemIndex: createErrorFactory(_error_symbols.CannotReindexSystemIndexInCurrent),
  reindexIsNotInQueue: createErrorFactory(_error_symbols.ReindexIsNotInQueue),
  multipleReindexJobsFound: createErrorFactory(_error_symbols.MultipleReindexJobsFound),
  reindexCannotBeCancelled: createErrorFactory(_error_symbols.ReindexCannotBeCancelled)
};
exports.error = error;