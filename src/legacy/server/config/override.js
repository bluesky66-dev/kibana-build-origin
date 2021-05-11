"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.override = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isObject = v => typeof v === 'object' && v !== null && !Array.isArray(v);

const assignDeep = (target, source) => {
  for (let [key, value] of Object.entries(source)) {
    // unwrap dot-separated keys
    if (key.includes('.')) {
      const [first, ...others] = key.split('.');
      key = first;
      value = {
        [others.join('.')]: value
      };
    }

    if (isObject(value)) {
      if (!target.hasOwnProperty(key)) {
        target[key] = {};
      }

      assignDeep(target[key], value);
    } else {
      target[key] = value;
    }
  }
};

const override = (...sources) => {
  const result = {};

  for (const object of sources) {
    assignDeep(result, object);
  }

  return result;
};

exports.override = override;