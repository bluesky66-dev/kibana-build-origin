"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeOverrides = mergeOverrides;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const OVERRIDES = {
  _source: {
    type: '_source'
  },
  _index: {
    type: 'string'
  },
  _type: {
    type: 'string'
  },
  _id: {
    type: 'string'
  },
  _timestamp: {
    type: 'date',
    searchable: true,
    aggregatable: true
  },
  _score: {
    type: 'number',
    searchable: false,
    aggregatable: false
  }
};
/**
 *  Merge overrides for specific metaFields
 *
 *  @param  {FieldDescriptor} field
 *  @return {FieldDescriptor}
 */

function mergeOverrides(field) {
  if (OVERRIDES.hasOwnProperty(field.name)) {
    return (0, _lodash.merge)(field, OVERRIDES[field.name]);
  } else {
    return field;
  }
}