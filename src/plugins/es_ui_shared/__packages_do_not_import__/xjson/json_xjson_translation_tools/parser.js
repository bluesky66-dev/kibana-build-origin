"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractJSONStringValues = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const JSON_COLON = ':';
const JSON_STRING_DELIMITER = '"';
const JSON_STRING_ESCAPE = '\\';
/**
 * Accepts JSON (as a string) and extracts the positions of all JSON string
 * values.
 *
 * For example:
 *
 * '{ "my_string_value": "is this", "my_number_value": 42 }'
 *
 * Would extract one result:
 *
 * [ { startIndex: 21, endIndex: 29 } ]
 *
 * This result maps to `"is this"` from the example JSON.
 *
 */

const extractJSONStringValues = input => {
  let position = 0;
  let currentStringStartPos;
  let isInsideString = false;
  const stringValues = [];

  function read() {
    return input[position];
  }

  function peekNextNonWhitespace() {
    let peekPosition = position + 1;

    while (peekPosition < input.length) {
      const peekChar = input[peekPosition];

      if (peekChar.match(/[^\s\r\n]/)) {
        return peekChar;
      }

      ++peekPosition;
    }
  }

  function advance() {
    ++position;
  }

  while (position < input.length) {
    const char = read();

    if (!isInsideString) {
      if (char === JSON_STRING_DELIMITER) {
        currentStringStartPos = position;
        isInsideString = true;
      } // else continue scanning for JSON_STRING_DELIMITER

    } else {
      if (char === JSON_STRING_ESCAPE) {
        // skip ahead - we are still inside of a string
        advance();
      } else if (char === JSON_STRING_DELIMITER) {
        if (peekNextNonWhitespace() !== JSON_COLON) {
          stringValues.push({
            startIndex: currentStringStartPos,
            endIndex: position
          });
        }

        isInsideString = false;
      }
    }

    advance();
  }

  return {
    stringValues
  };
};

exports.extractJSONStringValues = extractJSONStringValues;