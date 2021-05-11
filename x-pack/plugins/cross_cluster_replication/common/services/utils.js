"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeEmptyFields = exports.wait = exports.arrify = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const arrify = val => Array.isArray(val) ? val : [val];
/**
 * Utilty to add some latency in a Promise chain
 *
 * @param {number} time Time in millisecond to wait
 */


exports.arrify = arrify;

const wait = (time = 1000) => data => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), time);
  });
};
/**
 * Utility to remove empty fields ("") from a request body
 */


exports.wait = wait;

const removeEmptyFields = body => Object.entries(body).reduce((acc, [key, value]) => {
  if (value !== '') {
    acc[key] = value;
  }

  return acc;
}, {});

exports.removeEmptyFields = removeEmptyFields;