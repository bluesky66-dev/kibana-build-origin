"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ENTER_SPACE_PATH = exports.MAX_SPACE_INITIALS = exports.SPACE_SEARCH_COUNT_THRESHOLD = exports.UNKNOWN_SPACE = exports.ALL_SPACES_ID = exports.DEFAULT_SPACE_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_SPACE_ID = `default`;
/**
 * The identifier in a saved object's `namespaces` array when it is shared globally to all spaces.
 */

exports.DEFAULT_SPACE_ID = DEFAULT_SPACE_ID;
const ALL_SPACES_ID = '*';
/**
 * The identifier in a saved object's `namespaces` array when it is shared to an unknown space (e.g., one that the end user is not authorized to see).
 */

exports.ALL_SPACES_ID = ALL_SPACES_ID;
const UNKNOWN_SPACE = '?';
/**
 * The minimum number of spaces required to show a search control.
 */

exports.UNKNOWN_SPACE = UNKNOWN_SPACE;
const SPACE_SEARCH_COUNT_THRESHOLD = 8;
/**
 * The maximum number of characters allowed in the Space Avatar's initials
 */

exports.SPACE_SEARCH_COUNT_THRESHOLD = SPACE_SEARCH_COUNT_THRESHOLD;
const MAX_SPACE_INITIALS = 2;
/**
 * The path to enter a space.
 */

exports.MAX_SPACE_INITIALS = MAX_SPACE_INITIALS;
const ENTER_SPACE_PATH = '/spaces/enter';
exports.ENTER_SPACE_PATH = ENTER_SPACE_PATH;