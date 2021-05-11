"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagValidationError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Error returned from {@link TagsClient#create} or {@link TagsClient#update} when tag
 * validation failed.
 */

class TagValidationError extends Error {
  constructor(message, validation) {
    super(message);
    this.validation = validation;
    Object.setPrototypeOf(this, TagValidationError.prototype);
  }

}

exports.TagValidationError = TagValidationError;