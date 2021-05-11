"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ANNOTATION_EVENT_DELAYED_DATA = exports.ANNOTATION_EVENT_USER = exports.ANNOTATION_MAX_LENGTH_CHARS = exports.ANNOTATION_USER_UNKNOWN = exports.ANNOTATION_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let ANNOTATION_TYPE;
exports.ANNOTATION_TYPE = ANNOTATION_TYPE;

(function (ANNOTATION_TYPE) {
  ANNOTATION_TYPE["ANNOTATION"] = "annotation";
  ANNOTATION_TYPE["COMMENT"] = "comment";
})(ANNOTATION_TYPE || (exports.ANNOTATION_TYPE = ANNOTATION_TYPE = {}));

const ANNOTATION_USER_UNKNOWN = '<user unknown>'; // UI enforced limit to the maximum number of characters that can be entered for an annotation.

exports.ANNOTATION_USER_UNKNOWN = ANNOTATION_USER_UNKNOWN;
const ANNOTATION_MAX_LENGTH_CHARS = 1000;
exports.ANNOTATION_MAX_LENGTH_CHARS = ANNOTATION_MAX_LENGTH_CHARS;
const ANNOTATION_EVENT_USER = 'user';
exports.ANNOTATION_EVENT_USER = ANNOTATION_EVENT_USER;
const ANNOTATION_EVENT_DELAYED_DATA = 'delayed_data';
exports.ANNOTATION_EVENT_DELAYED_DATA = ANNOTATION_EVENT_DELAYED_DATA;