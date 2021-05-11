"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateExceptionListItemValidate = exports.validateComments = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const validateComments = item => {
  if (item.comments == null) {
    return [];
  }

  const [appendOnly] = item.comments.reduce((acc, comment) => {
    const [, hasNewComments] = acc;

    if (comment.id == null) {
      return [true, true];
    }

    if (hasNewComments && comment.id != null) {
      return [false, true];
    }

    return acc;
  }, [true, false]);

  if (!appendOnly) {
    return ['item "comments" are append only'];
  } else {
    return [];
  }
};

exports.validateComments = validateComments;

const updateExceptionListItemValidate = schema => {
  return [...validateComments(schema)];
};

exports.updateExceptionListItemValidate = updateExceptionListItemValidate;