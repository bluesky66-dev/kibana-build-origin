"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetterSetter = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createGetterSetter = name => {
  let value;

  const get = () => {
    if (!value) throw new Error(`${name} was not set.`);
    return value;
  };

  const set = newValue => {
    value = newValue;
  };

  return [get, set];
};

exports.createGetterSetter = createGetterSetter;