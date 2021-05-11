"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssignmentError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Error returned from {@link AssignmentService#updateTagAssignments}
 */

class AssignmentError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, AssignmentError.prototype);
  }

}

exports.AssignmentError = AssignmentError;