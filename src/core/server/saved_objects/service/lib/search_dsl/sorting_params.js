"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSortingParams = getSortingParams;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _mappings = require("../../../mappings");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const TOP_LEVEL_FIELDS = ['_id', '_score'];

function getSortingParams(mappings, type, sortField, sortOrder) {
  if (!sortField) {
    return {};
  }

  const types = Array.isArray(type) ? type : [type];

  if (TOP_LEVEL_FIELDS.includes(sortField)) {
    return {
      sort: [{
        [sortField]: {
          order: sortOrder
        }
      }]
    };
  }

  if (types.length > 1) {
    const rootField = (0, _mappings.getProperty)(mappings, sortField);

    if (!rootField) {
      throw _boom.default.badRequest(`Unable to sort multiple types by field ${sortField}, not a root property`);
    }

    return {
      sort: [{
        [sortField]: {
          order: sortOrder,
          unmapped_type: rootField.type
        }
      }]
    };
  }

  const [typeField] = types;
  let key = `${typeField}.${sortField}`;
  let field = (0, _mappings.getProperty)(mappings, key);

  if (!field) {
    // type field does not exist, try checking the root properties
    key = sortField;
    field = (0, _mappings.getProperty)(mappings, sortField);

    if (!field) {
      throw _boom.default.badRequest(`Unknown sort field ${sortField}`);
    }
  }

  return {
    sort: [{
      [key]: {
        order: sortOrder,
        unmapped_type: field.type
      }
    }]
  };
}