"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnomalyThresholdRangeError = exports.NotFoundError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.NotFoundError = NotFoundError;

class AnomalyThresholdRangeError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.AnomalyThresholdRangeError = AnomalyThresholdRangeError;