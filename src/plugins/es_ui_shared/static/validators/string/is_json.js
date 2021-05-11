"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isJSON = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isJSON = value => {
  try {
    const parsedJSON = JSON.parse(value);

    if (parsedJSON && typeof parsedJSON !== 'object') {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
};

exports.isJSON = isJSON;