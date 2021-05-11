"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFields = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFields = (data, fields = [], postFields = []) => {
  if (data.kind === 'Field' && data.selectionSet && !(0, _fp.isEmpty)(data.selectionSet.selections)) {
    return getFields(data.selectionSet, fields);
  } else if (data.kind === 'SelectionSet') {
    return data.selections.reduce((res, item) => {
      if (item.kind === 'Field') {
        const field = item;

        if (field.name.kind === 'Name' && field.name.value.includes('kpi')) {
          return [...res, field.name.value];
        } else if (field.selectionSet && !(0, _fp.isEmpty)(field.selectionSet.selections)) {
          return getFields(field.selectionSet, res, postFields.concat(field.name.value));
        }

        return [...res, [...postFields, field.name.value].join('.')];
      }

      return res;
    }, fields);
  }

  return fields;
};

exports.getFields = getFields;