"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectValuesToArrays = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Converts the top-level fields of an object from an object to an array.
 * @param record the obect to map
 * @type T the type of the objects/arrays that will be mapped
 */

const objectValuesToArrays = record => {
  const obj = {};
  Object.keys(record).forEach(key => {
    const value = record[key];
    obj[key] = value ? Array.isArray(value) ? value : [value] : [];
  });
  return obj;
};

exports.objectValuesToArrays = objectValuesToArrays;