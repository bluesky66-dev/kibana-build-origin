"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renameKeys = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const renameKeys = (keysMap, obj) => Object.keys(obj).reduce((acc, key) => {
  return { ...acc,
    ...{
      [keysMap[key] || key]: obj[key]
    }
  };
}, {});

exports.renameKeys = renameKeys;