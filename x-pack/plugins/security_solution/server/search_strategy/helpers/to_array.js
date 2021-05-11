"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toObjectArrayOfStrings = exports.toStringArray = exports.toArray = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const toArray = value => Array.isArray(value) ? value : value == null ? [] : [value];

exports.toArray = toArray;

const toStringArray = value => {
  if (Array.isArray(value)) {
    return value.reduce((acc, v) => {
      if (v != null) {
        switch (typeof v) {
          case 'number':
          case 'boolean':
            return [...acc, v.toString()];

          case 'object':
            try {
              return [...acc, JSON.stringify(v)];
            } catch {
              return [...acc, 'Invalid Object'];
            }

          case 'string':
            return [...acc, v];

          default:
            return [...acc, `${v}`];
        }
      }

      return acc;
    }, []);
  } else if (value == null) {
    return [];
  } else if (!Array.isArray(value) && typeof value === 'object') {
    try {
      return [JSON.stringify(value)];
    } catch {
      return ['Invalid Object'];
    }
  } else {
    return [`${value}`];
  }
};

exports.toStringArray = toStringArray;

const toObjectArrayOfStrings = value => {
  if (Array.isArray(value)) {
    return value.reduce((acc, v) => {
      if (v != null) {
        switch (typeof v) {
          case 'number':
          case 'boolean':
            return [...acc, {
              str: v.toString()
            }];

          case 'object':
            try {
              return [...acc, {
                str: JSON.stringify(v),
                isObjectArray: true
              }]; // need to track when string is not a simple value
            } catch {
              return [...acc, {
                str: 'Invalid Object'
              }];
            }

          case 'string':
            return [...acc, {
              str: v
            }];

          default:
            return [...acc, {
              str: `${v}`
            }];
        }
      }

      return acc;
    }, []);
  } else if (value == null) {
    return [];
  } else if (!Array.isArray(value) && typeof value === 'object') {
    try {
      return [{
        str: JSON.stringify(value),
        isObjectArray: true
      }];
    } catch {
      return [{
        str: 'Invalid Object'
      }];
    }
  } else {
    return [{
      str: `${value}`
    }];
  }
};

exports.toObjectArrayOfStrings = toObjectArrayOfStrings;