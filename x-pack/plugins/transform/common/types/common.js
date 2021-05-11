"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dictionaryToArray = dictionaryToArray;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// converts a dictionary to an array. note this loses the dictionary `key` information.
// however it's able to retain the type information of the dictionary elements.

function dictionaryToArray(dict) {
  return Object.keys(dict).map(key => dict[key]);
} // A recursive partial type to allow passing nested partial attributes.
// Used for example for the optional `jobConfig.dest.results_field` property.