"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFieldValidityAndErrorMessage = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getFieldValidityAndErrorMessage = field => {
  const isInvalid = !field.isChangingValue && field.errors.length > 0;
  const errorMessage = !field.isChangingValue && field.errors.length ? field.errors[0].message : null;
  return {
    isInvalid,
    errorMessage
  };
};

exports.getFieldValidityAndErrorMessage = getFieldValidityAndErrorMessage;