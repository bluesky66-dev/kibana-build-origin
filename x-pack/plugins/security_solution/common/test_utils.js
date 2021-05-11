"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeExternalLinkText = exports.getPaths = exports.foldLeftRight = void 0;

var _Either = require("fp-ts/lib/Either");

var _pipeable = require("fp-ts/lib/pipeable");

var _format_errors = require("./format_errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const onLeft = errors => {
  return {
    schema: {},
    errors
  };
};

const onRight = schema => {
  return {
    schema,
    errors: []
  };
};

const foldLeftRight = (0, _Either.fold)(onLeft, onRight);
/**
 * Convenience utility to keep the error message handling within tests to be
 * very concise.
 * @param validation The validation to get the errors from
 */

exports.foldLeftRight = foldLeftRight;

const getPaths = validation => {
  return (0, _pipeable.pipe)(validation, (0, _Either.fold)(errors => (0, _format_errors.formatErrors)(errors), () => ['no errors']));
};
/**
 * Convenience utility to remove text appended to links by EUI
 */


exports.getPaths = getPaths;

const removeExternalLinkText = str => str.replace(/\(opens in a new tab or window\)/g, '');

exports.removeExternalLinkText = removeExternalLinkText;