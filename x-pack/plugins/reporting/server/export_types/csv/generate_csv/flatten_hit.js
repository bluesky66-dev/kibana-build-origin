"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFlattenHit = createFlattenHit;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO this logic should be re-used with Discover


function createFlattenHit(fields, metaFields, conflictedTypesFields) {
  const flattenSource = (flat, obj, keyPrefix = '') => {
    keyPrefix = keyPrefix ? keyPrefix + '.' : '';

    _lodash.default.forOwn(obj, (val, key) => {
      key = keyPrefix + key;
      const hasValidMapping = fields.indexOf(key) >= 0 && conflictedTypesFields.indexOf(key) === -1;
      const isValue = !_lodash.default.isPlainObject(val);

      if (hasValidMapping || isValue) {
        if (!flat[key]) {
          flat[key] = val;
        } else if (_lodash.default.isArray(flat[key])) {
          flat[key].push(val);
        } else {
          flat[key] = [flat[key], val];
        }

        return;
      }

      flattenSource(flat, val, key);
    });
  };

  const flattenMetaFields = (flat, hit) => {
    _lodash.default.each(metaFields, meta => {
      if (meta === '_source') return;
      flat[meta] = hit[meta];
    });
  };

  const flattenFields = (flat, hitFields) => {
    _lodash.default.forOwn(hitFields, (val, key) => {
      if (key) {
        if (key[0] === '_' && !_lodash.default.includes(metaFields, key)) return;
        flat[key] = _lodash.default.isArray(val) && val.length === 1 ? val[0] : val;
      }
    });
  };

  return function flattenHit(hit) {
    const flat = {};
    flattenSource(flat, hit._source);
    flattenMetaFields(flat, hit);
    flattenFields(flat, hit.fields);
    return flat;
  };
}