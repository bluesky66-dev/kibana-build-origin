"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateIndexPattern = validateIndexPattern;

var _types = require("./types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function indexPatternContainsSpaces(indexPattern) {
  return indexPattern.includes(' ');
}

function findIllegalCharacters(indexPattern) {
  const illegalCharacters = _types.ILLEGAL_CHARACTERS_VISIBLE.reduce((chars, char) => {
    if (indexPattern.includes(char)) {
      chars.push(char);
    }

    return chars;
  }, []);

  return illegalCharacters;
}

function validateIndexPattern(indexPattern) {
  const errors = {};
  const illegalCharacters = findIllegalCharacters(indexPattern);

  if (illegalCharacters.length) {
    errors[_types.ILLEGAL_CHARACTERS_KEY] = illegalCharacters;
  }

  if (indexPatternContainsSpaces(indexPattern)) {
    errors[_types.CONTAINS_SPACES_KEY] = true;
  }

  return errors;
}