"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTag = void 0;

var _validation = require("../../../common/validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const validateTag = attributes => {
  const validation = {
    valid: true,
    warnings: [],
    errors: {}
  };
  validation.errors.name = (0, _validation.validateTagName)(attributes.name);
  validation.errors.color = (0, _validation.validateTagColor)(attributes.color);
  validation.errors.description = (0, _validation.validateTagDescription)(attributes.description);
  Object.values(validation.errors).forEach(error => {
    if (error) {
      validation.valid = false;
    }
  });
  return validation;
};

exports.validateTag = validateTag;