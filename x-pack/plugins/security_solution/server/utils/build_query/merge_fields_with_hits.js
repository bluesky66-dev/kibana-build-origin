"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeFieldsWithHit = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mergeFieldsWithHit = (fieldName, flattenedFields, fieldMap, hit) => {
  if (fieldMap[fieldName] != null) {
    const esField = fieldMap[fieldName];

    if ((0, _fp.has)(esField, hit._source)) {
      const objectWithProperty = {
        node: { ...(0, _fp.get)('node', flattenedFields),
          ...fieldName.split('.').reduceRight((obj, next) => ({
            [next]: obj
          }), (0, _fp.get)(esField, hit._source))
        }
      };
      return (0, _fp.merge)(flattenedFields, objectWithProperty);
    } else {
      return flattenedFields;
    }
  } else {
    return flattenedFields;
  }
};

exports.mergeFieldsWithHit = mergeFieldsWithHit;