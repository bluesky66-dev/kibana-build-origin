"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAlertExecutor = exports.isValidUnit = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// used for gap detection code
// eslint-disable-next-line @typescript-eslint/naming-convention

const isValidUnit = unitParam => ['s', 'm', 'h'].includes(unitParam);

exports.isValidUnit = isValidUnit; // This returns true because by default a RuleAlertTypeDefinition is an AlertType
// since we are only increasing the strictness of params.

const isAlertExecutor = obj => {
  return true;
};

exports.isAlertExecutor = isAlertExecutor;