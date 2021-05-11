"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseOrUndefined = exports.decodeCursor = exports.encodeCursor = exports.contextCursor = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _Either = require("fp-ts/lib/Either");

var _pipeable = require("fp-ts/lib/pipeable");

var _shared_imports = require("../../../common/shared_imports");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Used only internally for this ad-hoc opaque cursor structure to keep track of the
 * current page_index that the search_after is currently on. The format of an array
 * is to be consistent with other compact forms of opaque nature such as a saved object versioning.
 *
 * The format is [index of item, search_after_array]
 */
// TODO: Use PositiveInteger from siem once that type is outside of server and in common


const contextCursor = t.tuple([t.number, t.union([t.array(t.string), t.undefined])]);
exports.contextCursor = contextCursor;

const encodeCursor = ({
  searchAfter,
  page,
  perPage
}) => {
  const index = searchAfter != null ? page * perPage : 0;
  const encodedCursor = searchAfter != null ? [index, searchAfter] : [index];
  const scrollStringed = JSON.stringify(encodedCursor);
  return Buffer.from(scrollStringed).toString('base64');
};

exports.encodeCursor = encodeCursor;

const decodeCursor = ({
  cursor,
  page,
  perPage,
  sortField
}) => {
  if (cursor == null) {
    return {
      cursor: [0, undefined],
      errorMessage: '',
      isValid: true
    };
  } else {
    const fromBuffer = Buffer.from(cursor, 'base64').toString();
    const parsed = parseOrUndefined(fromBuffer);

    if (parsed == null) {
      return {
        cursor: [0, undefined],
        errorMessage: 'Error parsing JSON from base64 encoded cursor',
        isValid: false
      };
    } else {
      const decodedCursor = contextCursor.decode(parsed);
      const checked = (0, _shared_imports.exactCheck)(parsed, decodedCursor);

      const onLeft = () => undefined;

      const onRight = schema => schema;

      const cursorOrUndefined = (0, _pipeable.pipe)(checked, (0, _Either.fold)(onLeft, onRight));
      const startPageIndex = (page - 1) * perPage;

      if (cursorOrUndefined == null) {
        return {
          cursor: [0, undefined],
          errorMessage: 'Error decoding cursor structure',
          isValid: false
        };
      } else {
        const [index, searchAfter] = cursorOrUndefined;

        if (index < 0) {
          return {
            cursor: [0, undefined],
            errorMessage: 'index of cursor cannot be less 0',
            isValid: false
          };
        } else if (index > startPageIndex) {
          return {
            cursor: [0, undefined],
            errorMessage: `index: ${index} of cursor cannot be greater than the start page index: ${startPageIndex}`,
            isValid: false
          };
        } else if (searchAfter != null && searchAfter.length > 1 && sortField == null) {
          return {
            cursor: [0, undefined],
            errorMessage: '',
            isValid: false
          };
        } else {
          return {
            cursor: [index, searchAfter != null ? searchAfter : undefined],
            errorMessage: '',
            isValid: true
          };
        }
      }
    }
  }
};

exports.decodeCursor = decodeCursor;

const parseOrUndefined = input => {
  try {
    return JSON.parse(input);
  } catch (err) {
    return undefined;
  }
};

exports.parseOrUndefined = parseOrUndefined;