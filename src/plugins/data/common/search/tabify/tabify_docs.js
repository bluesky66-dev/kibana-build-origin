"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenHit = flattenHit;
exports.tabifyDocs = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function flattenHit(hit, indexPattern, params) {
  const flat = {};

  function flatten(obj, keyPrefix = '') {
    for (const [k, val] of Object.entries(obj)) {
      const key = keyPrefix + k;
      const field = indexPattern === null || indexPattern === void 0 ? void 0 : indexPattern.fields.getByName(key);

      if ((params === null || params === void 0 ? void 0 : params.shallow) === false) {
        const isNestedField = (field === null || field === void 0 ? void 0 : field.type) === 'nested';

        if (Array.isArray(val) && !isNestedField) {
          val.forEach(v => (0, _lodash.isPlainObject)(v) && flatten(v, key + '.'));
          continue;
        }
      } else if (flat[key] !== undefined) {
        continue;
      }

      const hasValidMapping = (field === null || field === void 0 ? void 0 : field.type) !== 'conflict';
      const isValue = !(0, _lodash.isPlainObject)(val);

      if (hasValidMapping || isValue) {
        if (!flat[key]) {
          flat[key] = val;
        } else if (Array.isArray(flat[key])) {
          flat[key].push(val);
        } else {
          flat[key] = [flat[key], val];
        }

        continue;
      }

      flatten(val, key + '.');
    }
  }

  flatten(hit.fields);

  if ((params === null || params === void 0 ? void 0 : params.source) !== false && hit._source) {
    flatten(hit._source);
  }

  if ((params === null || params === void 0 ? void 0 : params.meta) !== false) {
    // combine the fields that Discover allows to add as columns
    const {
      _id,
      _index,
      _type,
      _score
    } = hit;
    flatten({
      _id,
      _index,
      _score,
      _type
    });
  }

  return flat;
}

const tabifyDocs = (esResponse, index, params = {}) => {
  const columns = [];
  const rows = esResponse.hits.hits.map(hit => {
    const flat = flattenHit(hit, index, params);

    for (const [key, value] of Object.entries(flat)) {
      const field = index === null || index === void 0 ? void 0 : index.fields.getByName(key);
      const fieldName = (field === null || field === void 0 ? void 0 : field.name) || key;

      if (!columns.find(c => c.id === fieldName)) {
        const fieldType = (field === null || field === void 0 ? void 0 : field.type) || typeof value;
        const formatter = field && (index === null || index === void 0 ? void 0 : index.getFormatterForField(field));
        columns.push({
          id: fieldName,
          name: fieldName,
          meta: {
            type: fieldType,
            field: fieldName,
            index: index === null || index === void 0 ? void 0 : index.id,
            params: formatter ? formatter.toJSON() : undefined
          }
        });
      }
    }

    return flat;
  }).filter(hit => hit);
  return {
    type: 'datatable',
    columns,
    rows
  };
};

exports.tabifyDocs = tabifyDocs;